const fs = require('fs');
const path = require('path');
const util = require('util');
const https = require('https');

const asyncMkdir = util.promisify(fs.mkdir);
const asyncExists = util.promisify(fs.exists);
const asyncWriteFile = util.promisify(fs.writeFile);

const projectDir = __dirname;
const databaseDir = path.join(projectDir, 'db');
const imagesDir = path.join(databaseDir, 'images');
const databaseFile = path.join(databaseDir, 'data.json');

const imagesPublicPath = './images';
const usersApiUrl = 'https://reqres.in/api/users';

/**
 * Функция получения случайного строкового идентификатора
 * Не использовать в production! Лучше взять модуль uuid.
 *
 * @returns {string}
 */
function getRandomId() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 10) +
    Math.random()
      .toString(36)
      .substring(2, 10)
  );
}

/**
 * @param {number} id
 * @returns {Promise<any>}
 */
async function fetchUserById(id) {
  return new Promise((resolve, reject) => {
    https
      .get(`${usersApiUrl}/${id}`, res => {
        // Если код ответа не 2xx, то бросаем ошибку
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`statusCode - ${res.statusCode}`));
        }

        // Читаем все отправленные сервером байты в массив
        let body = [];
        res.on('data', chunk => body.push(chunk));

        res.on('end', () => {
          try {
            // После завершения чтения тела ответа, преобразуем байты в JS объект
            body = JSON.parse(Buffer.concat(body).toString());
          } catch (e) {
            // Если это был не корректный JSON, то бросаем ошибку
            reject(e);
          }

          // Резолвим Promise с распарсенным и готовым к работе телом ответа
          resolve(body);
        });
      })
      .on('error', err => {
        // Реджектим Promise если в ходе запроса произошла ошибка
        reject(err);
      });
  });
}

/**
 * @param {number} id
 * @returns {Promise<Buffer>}
 */
async function fetchImageFromUrl(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, res => {
        // Если код ответа не 2xx, то бросаем ошибку
        if (res.statusCode < 200 || res.statusCode >= 300) {
          return reject(new Error(`statusCode - ${res.statusCode}`));
        }

        // Читаем все отправленные сервером байты в массив
        let body = [];
        res.on('data', chunk => body.push(chunk));

        res.on('end', () => {
          try {
            // После завершения чтения тела ответа, сохраняем байты в Buffer
            body = Buffer.concat(body);
          } catch (e) {
            // Если это был не корректный JSON, то бросаем ошибку
            reject(e);
          }

          // Резолвим Promise с распарсенным и готовым к работе телом ответа
          resolve(body);
        });
      })
      .on('error', err => {
        // Реджектим Promise если в ходе запроса произошла ошибка
        reject(err);
      });
  });
}

async function createDatabase() {
  // Создаём директорию для базы данных если она отсутствует
  if (!(await asyncExists(databaseDir))) {
    await asyncMkdir(databaseDir);
  }

  // Создаём директорию для картинок если она отсутствует
  if (!(await asyncExists(imagesDir))) {
    await asyncMkdir(imagesDir);
  }

  // Генерируем ID'шники пользователей
  const userIds = Array(10)
    .fill(0)
    .map((e, i) => i + 1);

  // Делаем N параллельных запросов за пользователями и ждём их выполнения
  const rawUsersData = await Promise.all(userIds.map(fetchUserById));

  // Делаем N параллельных запросов за аватарками и ждём их выполнения
  const rawUsersAvatars = await Promise.all(
    rawUsersData.map(rawUser => fetchImageFromUrl(rawUser['data'].avatar))
  );

  // Создаём массив для Promis'ов, внутри которых будет происходить сохранение изображений
  const avatarSavingPromises = [];

  // Формируем итоговую структуру "базы"
  const preparedData = [];
  for (let i = 0; i < rawUsersData.length; i++) {
    const userData = rawUsersData[i]['data'];

    const avatarExtension = path.extname(userData.avatar);
    const avatarFilename = `${userData.first_name}_${userData.last_name}${avatarExtension}`;

    const imagePath = path.join(imagesDir, avatarFilename);
    const imagePublicPath = `${imagesPublicPath}/${avatarFilename}`;

    // Запускаем промис с сохранением файла и записываем его в массив
    avatarSavingPromises.push(asyncWriteFile(imagePath, rawUsersAvatars[i]));

    // Формируем новые объекты с описанием пользователя
    // Генерируем для них новые уникальные ID
    // Генерируем имя файла относительно директории db
    // Генерируем полное имя пользователя на основе фамилии и имени
    preparedData.push({
      id: getRandomId(),
      name: `${userData.first_name} ${userData.last_name}`,
      avatar: imagePublicPath
    });
  }

  // Ждём завершения записи Buffer'ов, содержащих аватары пользователей, в файлы
  await Promise.all(avatarSavingPromises);
  // Записываем данные пользователей в файл
  await asyncWriteFile(databaseFile, JSON.stringify(preparedData, null, 2));
}

createDatabase()
  .then(() => console.log('Done!'))
  .catch(err => console.error(err));

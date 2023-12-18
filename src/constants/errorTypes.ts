import { TResponseError } from "../types/TResponseError";

export const ERROR_TYPES: TResponseError[] = [
  {
    critical: true,
    description: "Не обнаружены папка или файл. Необходимо изменить путь к папке (файлу).",
    type: "system",
    searchValue: "no such file or directory"
  },
  {
    critical: true,
    description: "Нет значений в заголовке листа. Необходимо внести в данные из заголовка excel таблицы, в заголовок листа Google таблицы.",
    type: "google",
    searchValue: "No values in the header row"
  },
  {
    critical: true,
    description: "Выполнение запроса превысит лимит ячеек Google таблицы. Google таблица имеет лимит в 10 000 000 ячеек (всего, как ячеек с данными, так и пустых), " +
      "если при загрузке данных этот лимит будет превышен, то данные не будут загружены. Необходимо либо включить предварительную очистку данных" +
      ", либо пересмотреть структуру документа для уменьшения количества ячеек.",
    type: "google",
    searchValue: "limit of 10000000 cells"
  },
  {
    critical: false,
    description: "Севис не доступен. Возможные причины возникновения ошибки: превышено количество запросов в минуту; превышено " +
      "количество запросов к конкретной таблице; сервисы Google временно не могут обработать запрос. Решение для всех случаев - немного подождать.",
    type: "google",
    searchValue: "The service is currently unavailable"
  },

  {
    critical: true,
    description: "В Google таблице не найден лист, на который Вы пытаетесь загрузить данные. Возможных причин несколько: " +
      "лист переименован, лист удалён, удалена Google таблица.",
    type: "google",
    searchValue: "Cannot read properties of undefined"
  },

  {
    critical: true,
    description: "Ошибка прав доступа. Необходимо выдать права на редактирование листа сервис-аккаунту.",
    type: "google",
    searchValue: "The caller does not have permission"
  },

  {
    critical: false,
    description: "Превышена квота запросов. Необходимо немного подождать, квоты обновляются каждую минуту.",
    type: "google",
    searchValue: "[429]"
  },

  {
    critical: true,
    description: "Имеются не уникальные заголовки. Убедитесь, что все не пустые заголовки, на указанном листе, уникальны",
    type: "google",
    searchValue: "Duplicate header detected"
  },

  {
    critical: false,
    description: "Операция была отклонена. Необходимо немного подождать.",
    type: "google",
    searchValue: "[409]"
  },


];






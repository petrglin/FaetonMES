export const easyOrderScreenshots = {
  "store-efficiency-dashboard": {
    "src": "/crm/easyorder/store-efficiency-dashboard.webp?v=2026",
    "width": 1600,
    "height": 1100
  },
  "dashboard": {
    "src": "/crm/easyorder/styled/dashboard.webp?v=2026",
    "width": 1600,
    "height": 1000
  },
  "clients": {
    "src": "/crm/easyorder/styled/clients.webp",
    "width": 1600,
    "height": 1000
  },
  "order": {
    "src": "/crm/easyorder/styled/order.webp?v=2026",
    "width": 1600,
    "height": 1000
  },
  "composition": {
    "src": "/crm/easyorder/styled/composition.webp?v=2026",
    "width": 1600,
    "height": 1000
  },
  "files": {
    "src": "/crm/easyorder/styled/files.webp?v=2026",
    "width": 1600,
    "height": 1000
  },
  "appointments": {
    "src": "/crm/easyorder/styled/appointments.webp?v=2026",
    "width": 1600,
    "height": 1000
  },
  "calendar": {
    "src": "/crm/easyorder/styled/calendar.webp?v=2026",
    "width": 1600,
    "height": 1000
  },
  "store-statistics": {
    "src": "/crm/easyorder/styled/store-statistics.webp?v=2026",
    "width": 1600,
    "height": 1000
  },
  "manager-statistics": {
    "src": "/crm/easyorder/styled/manager-statistics.webp?v=2026",
    "width": 1600,
    "height": 1000
  },
  "network-statistics": {
    "src": "/crm/easyorder/styled/network-statistics.webp?v=2026",
    "width": 1600,
    "height": 1000
  },
  "chat": {
    "src": "/crm/easyorder/styled/chat.webp?v=2026",
    "width": 1600,
    "height": 1000
  },
  "design-integration": {
    "src": "/crm/easyorder/design-integration.webp",
    "width": 990,
    "height": 830
  },
  "workflow": {
    "src": "/crm/easyorder/styled/workflow.webp",
    "width": 1600,
    "height": 1000
  }
} as const;

export const easyOrderFeatures = [
  {
    title: "Лиды и клиенты",
    text: "Лиды, просчёты и заказы в одной системе. Карточки физических и юридических лиц, история взаимодействий и переход от лида к клиенту на основе модели статусов. Информация доступна из любой точки.",
    screenshot: "clients",
    caption: "Карточка клиента и история взаимодействий",
  },
  {
    title: "Вся информация о заказе",
    text: "Данные клиента, параметры заказа, состав, платежи и замеры. К заказу привязаны KIT/XML-файлы 2020 Design, запланированные и выполненные доставки, монтаж и претензии. Поддерживаются розничные и оптовые заказы.",
    screenshot: "order",
    caption: "Карточка заказа: параметры, документы и связанные работы",
  },
  {
    title: "Состав заказа и ценообразование",
    text: "Создание заказов из KIT-файлов Design или ручной ввод заказов на мебель, двери и индивидуальные дома. Состав разбивается на категории продуктов и может редактироваться. Для дилеров доступны свои прайс-листы и группы продукции, а конструктор скидок и акций поддерживает сложные правила. В проекте с продукцией разных производителей можно отправлять заказы каждому из них.",
    screenshot: "composition",
    caption: "Позиции заказа, категории продукции и цены",
  },
  {
    title: "Файлы и документы",
    text: "Визуализации, рисунки, чертежи, инструкции, отчёты, договоры и спецификации прикрепляются к заказам вручную или автоматически. Пользователю может быть выделено собственное хранилище рабочей информации.",
    screenshot: "files",
    caption: "Вложения и визуализации в контексте заказа",
  },
  {
    title: "Замеры, доставка и сборка",
    text: "Отдельные роли замерщиков, сборщиков и службы доставки. Планирование и назначение задач, управление календарём и контроль сроков выполнения. Исполнители получают уведомления и напоминания, а замерщики могут прикреплять KIT-файлы с результатами замеров.",
    screenshot: "appointments",
    caption: "Назначение замеров и исполнителей по заказу",
  },
  {
    title: "Задачи и интерактивный календарь",
    text: "Планирование собственного рабочего дня и графика подчинённых. Задачи связываются с лидами, клиентами или заказами; старшие менеджеры назначают задания продавцам. Уведомления в реальном времени помогают контролировать просроченные и выполненные задачи.",
    screenshot: "calendar",
    caption: "Календарь задач и загрузка сотрудников",
  },
] as const;

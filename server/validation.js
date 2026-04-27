import { body } from 'express-validator';

export const registerValidation = [
    body('email', 'Невеный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5}),
    body('fullName', 'Укажите имя').isLength({ min: 3}),
    body('birthday', 'Неверный формат даты').optional().isISO8601(), // Проверка на дату (опционально)
    body('phone', 'Неверный формат телефона').isMobilePhone(),
];

export const loginValidation = [
    body('email', 'Невеный формат почты').optional().isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5}),
    body('phone', 'Неверный формат телефона').optional().isMobilePhone(),
];

export const reviewValidation = [
    body('OrderID', 'Невеный номера заказа').isNumeric(),
    body('Evaluation', 'Неверный формат оценки. От 1 до 5').isInt({ min: 1, max: 5 }),
];

export const someAnalysisParametrValidation = [
    body('UserID', 'Невеный тип id пользователя').isNumeric(),
    body('ShowCompletedOnly', 'Неверный формат параметра типа статуса заказа').optional().isInt({ min: 0, max: 1 }),
    body('StartPeriod', 'Неверный формат начальной даты').isISO8601(),
    body('EndPeriod', 'Неверный формат конечной даты').isISO8601(),
];

export const CreateOrderValidation = [
    body('Cost', 'Неверный формат стоимости').optional().isNumeric(),
    body('Path_lenght', 'Неверный формат длинны пути').optional().isNumeric(),
    body('Number_of_passengers', 'Неверный формат количества пассажиров').optional().isNumeric(),
    body('class_of_serviceID', 'Неверный формат класса обслуживания').optional().isNumeric(),
    body('Cargo_weight', 'Неверный формат веса груза').optional().isNumeric(),
    body('Dimensions_of_the_cargo', 'Неверный формат измерения груза').optional().isNumeric(),
    body('Type_of_cargoID', 'Неверный формат типа груза').optional().isNumeric(),
];
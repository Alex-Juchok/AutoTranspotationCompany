
import express from 'express';
import sql from 'mssql'
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { faker } from '@faker-js/faker';


import { registerValidation, loginValidation, reviewValidation, someAnalysisParametrValidation } from './validation.js';
import handleValidationErrors from './utils/handleValidationError.js'
import DataOrdersFormating from './utils/DataOrdersFormating.js';
import checkAuth from './utils/checkAuth.js';


const app = express();
app.use(express.json());


var config = {
    "user": "pupu", // Database username
    "password": "qwerty123", // Database password
    "server": "OPTION", // Server IP address
    "database": "Auto_transportation_company", // Database name
    "options": {
        "encrypt": false // Disable encryption
    }
}

// Connect to SQL Server
sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("BD ok");
    
});

app.use(cors());


async function getUserByEmail(email) {
    try {
        await sql.connect(config);

        // SQL-запрос для получения пользователя по email
        const result = await sql.query`SELECT * FROM Client WHERE Email = ${email}`;

        // Если пользователь найден, возвращаем его данные
        if (result.recordset.length > 0) {
            console.log(result.recordset[0])
            return result.recordset[0];
        } else {
            return null; // Возвращаем null, если пользователь не найден
        }
    } catch (err) {
        console.error('Ошибка при получении пользователя по email:', err);
        throw err;
    } finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
}

async function getUserByPhone(phone) {
    try {
        await sql.connect(config);

        // SQL-запрос для получения пользователя по email
        const result = await sql.query`SELECT * FROM Client WHERE Telephone = ${phone}`;

        // Если пользователь найден, возвращаем его данные
        if (result.recordset.length > 0) {
            console.log(result.recordset[0])
            return result.recordset[0];
        } else {
            return null; // Возвращаем null, если пользователь не найден
        }
    } catch (err) {
        console.error('Ошибка при получении пользователя по phone:', err);
        throw err;
    } finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
}
app.post('/auth/login', loginValidation, handleValidationErrors, async (req, res) => {
    try {
        const { email, phone, password } = req.body;

        let user = undefined;
        // Проверка наличия пользователя в базе данных по email
        if (email)
            user = await getUserByEmail(email);
        else if (phone)
            user = await getUserByPhone(phone);

        if (!user) {
            return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
        }

        // Проверка правильности введенного пароля
        const passwordMatch = await bcrypt.compare(password, user.Password);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Неверный email или пароль' });
        }

        let token = undefined;
        // Создание JWT токена
        if (email)
            token = jwt.sign({ userId: user.id, email: user.email }, 'secret_key', { expiresIn: '10h' }); // Установите срок действия токена
        else if (phone)
            token = jwt.sign({ userId: user.id, phone: user.Telephone }, 'secret_key', { expiresIn: '10h' }); // Установите срок действия токена
        
        const userData = { ...user };
        delete userData.Password;
    
        res.json({
            success: true,
            message: 'Успешная авторизация',
            token: token,
            userData,
        });
    } catch (err) {
        console.error('Ошибка авторизации:', err);
        res.status(500).json({ success: false, message: 'Ошибка авторизации' });
    }
});


app.post('/auth/register', registerValidation, handleValidationErrors, async (req, res) => {
    try {

        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const PasswordHash = await bcrypt.hash(password, salt);
        await sql.connect(config);

        // Вызов хранимой процедуры с передачей параметров
        await sql.query`EXEC AddClient @Full_name = ${req.body.fullName}, @Telephone = ${req.body.phone}, @Email = ${req.body.email}, @Password = ${PasswordHash}, @Data_birtday = ${req.body.birthday}`;

        console.log('Клиент успешно добавлен.');
        const token = jwt.sign({ email: req.body.email }, 'secret_key'); // Замените 'secret_key' на ваш секретный ключ

        // Отправка ответа с токеном
        res.json({
            success: true,
            message: 'Клиент успешно добавлен.',
            token: token
        });
    } catch (err) {
        console.error('Ошибка при добавлении клиента:', err);
        res.status(500).json({
            success: false,
            message: 'Не удалось добавить клиента.',
        });
    } finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
});

const sortOrdersById = (orders) => {
    // Сортируем массив по ID
    return orders.sort((a, b) => a.ID - b.ID);
};


app.get('/Orders/getAllOrders/:UserID', checkAuth, async(req, res) => {
    try {
        const UserId = req.params.UserID;
        if (!isNaN(UserId) && !isNaN(parseFloat(UserId))){
            await sql.connect(config);

            // Вызов хранимой процедуры с передачей параметров
            const result = await sql.query`EXEC GetUserOrders
            @UserID = ${UserId};`;

            if(!isNaN(result.recordsets[0])){
                return res.status(200).json({ success: true, data: false, message: 'Данные пользователя не найдены' });
            }else{
                result.recordsets[0] = DataOrdersFormating(result.recordsets[0])
                result.recordsets[0] = sortOrdersById(result.recordset);

            res.json({
                success: true,
                data: true,
                message: 'Данные заказов успешно получены.',
                ...result.recordsets[0]
            });
        }
        }else 
            return res.status(401).json({ success: false, message: 'Неверный тип данных пользователя' });
    } catch (err) {
        console.error('Ошибка при получении данных заказа клиента:', err);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении данных заказа клиента',
        });
    } finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
});

app.get('/Orders/getOneOrderDetail/:OrderID', checkAuth, async(req, res) => {
    try {
        const OrderID = req.params.OrderID;

        if (!isNaN(OrderID) && !isNaN(parseFloat(OrderID))){
            await sql.connect(config);

            // Вызов хранимой процедуры с передачей параметров
            const result = await sql.query`Exec GetOrderDetails 
            @OrderID = ${OrderID};`;

            if(!isNaN(result.recordsets[0])){
                return res.status(404).json({ success: false, message: 'Данные заказе не найдены' });
            }else{                  
                result.recordsets[0] = DataOrdersFormating(result.recordsets[0])


                res.json({
                    success: true,
                    message: 'Данные заказов успешно получены.',
                    ...result.recordsets
                });
            }
        }else 
            return res.status(401).json({ success: false, message: 'Неверный тип данных заказа' });
    } catch (err) {
        console.error('Ошибка при получении данных заказа клиента:', err);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении данных заказа клиента',
        });
    } finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
});

app.post('/AddReview', checkAuth, reviewValidation, handleValidationErrors, async(req, res) => {
    try {
        const { OrderID, Description, Evaluation } = req.body;
        
        await sql.connect(config);

            // Вызов хранимой процедуры с передачей параметров
            const result = await sql.query`Exec AddReview
            @OrderID=${OrderID},
            @Description=${Description},
            @Evaluation=${Evaluation};`;

            if (result.recordsets && result.recordsets[0]) {
                const response = result.recordsets[0][0];
                
                if (response.Message) {
                    res.json({
                        success: true,
                        message: response.Message
                    });
                } else if (response.ErrorMessage) {
                    res.status(401).json({
                        success: false,
                        error: response.ErrorMessage
                    });
                }
            }
       
    } catch (err) {
        console.error('Ошибка при добавлении отзыва: ', err);
        res.status(500).json({
            success: false,
            message: 'Ошибка при добавлении отзыва',
        });
    } finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
});


app.post('/Orders/CancelOrder', checkAuth, async(req, res) => {
    try {
        const OrderID = JSON.parse(req.body.OrderID);

        if (OrderID.every(item => !isNaN(item) && !isNaN(parseFloat(item)))){
            const valuesString = OrderID.map(id => `(${id})`).join(', ');
            await sql.connect(config);

            const request = new sql.Request();
            request.input('OrderIDsUnique', sql.NVarChar, valuesString);


            const result = await request.query(`
                DECLARE @OrderIDs OrderIDType;
                
                INSERT INTO @OrderIDs (OrderID)
                VALUES ${valuesString}; 
                
                EXEC CancelOrders @OrderIDs;
            `);

            if (result.recordsets && result.recordsets[0]) {
                const response = result.recordsets[0][0];
                
                if (response.Message) {
                    res.json({
                        success: true,
                        message: response.Message
                    });
                } else if (response.ErrorMessage) {
                    res.status(401).json({
                        success: false,
                        error: response.ErrorMessage
                    });
                }
            }
          
        }
        else 
            return res.status(401).json({ success: false, message: 'Неверный тип данных' });

    } catch (err) {
        console.error('Ошибка при отмене заказов: ', err);
        res.status(500).json({
            success: false,
            message: 'Ошибка при отмене заказов',
        });
    } finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
});

app.post('/AnalysisOrders', checkAuth, someAnalysisParametrValidation, handleValidationErrors, async(req, res) => {
    try {
        const { UserID, StartPeriod, EndPeriod, PeriodType, AggregationType, ShowCompletedOnly, OrderType, ClassOfService, TypeOfCargo } = req.body;
        // console.log(UserID+" : "+StartPeriod+" : "+EndPeriod+" : "+PeriodType+" : "+AggregationType+" : "+ShowCompletedOnly+" : "+OrderType+" : " +ClassOfService+" : "+TypeOfCargo )
        if (PeriodType == 'day' || PeriodType == 'month' || PeriodType == 'year'|| PeriodType == 'quarter'){
            console.log(AggregationType)
            if (AggregationType == 'total' || AggregationType == 'average'){
                if (OrderType === null || OrderType === undefined || OrderType === 'passenger' || OrderType === 'cargo') {
                    await sql.connect(config);

                    // Вызов хранимой процедуры с передачей параметров
                    const result = await sql.query`EXEC GetOrderStatsByPeriod
                    @UserID = ${UserID},
                    @StartPeriod = ${StartPeriod},
                    @EndPeriod = ${EndPeriod},
                    @PeriodType = ${PeriodType}, -- "day", "month", "year", "quarter"
                    @AggregationType= ${AggregationType},  -- "total", "average"
                    @ShowCompletedOnly= ${ShowCompletedOnly},
                    @OrderType = ${OrderType},  -- "passenger", "cargo", or NULL for all orders
                    @ClassOfService= ${ClassOfService}, 
                    @TypeOfCargo = ${TypeOfCargo};`;

                    if(!isNaN(result.recordsets[0])){
                        return res.status(404).json({ success: false, message: 'Данные анализа не найдены' });
                    }else{
                        console.log(result.recordsets[0])
                        result.recordsets[0].map(record => {           
                        const PeriodStart = new Date(record.PeriodStart);
                        record.PeriodStart = PeriodStart.toLocaleDateString('ru-RU');
                        const PeriodEnd = new Date(record.PeriodEnd);
                        record.PeriodEnd = PeriodEnd.toLocaleDateString('ru-RU');

                        if(record.TotalTravelTime != undefined){ 
                            const timeParts = record.TotalTravelTime.split(":");
                            const hours = parseInt(timeParts[0]);
                            const minutes = parseInt(timeParts[1]);
                            const seconds = parseInt(timeParts[2]);

                            record.totalTimeInMinutes = hours * 60 + minutes + seconds / 60;
                        }else if(record.AvgTravelTime != undefined){
                            const timeParts = record.AvgTravelTime.split(":");
                            const hours = parseInt(timeParts[0]);
                            const minutes = parseInt(timeParts[1]);
                            const seconds = parseInt(timeParts[2]);

                            record.AverageTimeInMinutes = hours * 60 + minutes + seconds / 60;
                        }
                        return record;
                        });
                        res.json({
                            success: true,
                            message: 'Данные заказов успешно получены.',
                            ...result.recordsets
                        });
            }
        }else
            return res.status(401).json({ success: false, message: 'Неверный тип заказа' });
        }else
            return res.status(401).json({ success: false, message: 'Неверный тип агригации' });
        }else 
            return res.status(401).json({ success: false, message: 'Неверный тип периода' });
    } catch (err) {
        console.error('Ошибка при получении данных заказа клиента:', err);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении данных заказа клиента',
        });
    } finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
});

  
  // Использование функции
app.post('/CreateOrder', checkAuth, async(req, res) => {
    try {
        const { 
            ClientID,
            Type_of_paymentID,
            Types_of_orderID,
            Number_of_passengers,
            class_of_serviceID,
            Cargo_weight,
            Dimensions_of_the_cargo,
            Type_of_cargoID} = req.body;
            const rawAddressesData = req.body.AddressesData
            // Парсинг строки в массив объектов
            const AddressesData = rawAddressesData.split("], [")
              .map(item => item.replace(/[\[\]]/g, '').split(', '))
              .map(arr => ({
                Name: arr[0].replace(/'/g, ''),
                Street: arr[1].replace(/'/g, ''),
                House: arr[2] === 'null' ? null : parseInt(arr[2]),
                Body: arr[3] === 'null' ? null : parseInt(arr[3]),
                AddressOrder: parseInt(arr[4])
              }));

                const isString = (value) => typeof value === 'string';
                const isNumber = (value) => typeof value === 'number' && !isNaN(value);

                const isValidAddress = (address) => {
                return isString(address.Name) && isString(address.Street) &&
                        (address.House === null || isNumber(address.House)) &&
                        (address.Body === null || isNumber(address.Body)) &&
                        isNumber(address.AddressOrder);
                };

                const invalidAddress = AddressesData.find(address => !isValidAddress(address));

                if (invalidAddress) {
                    return res.status(401).json({ success: false, message: 'Неверный тип адреса' });
                }

                const addressSet = new Set();
                const duplicateAddress = AddressesData.find(address => {
                const addressString = `${address.Name}, ${address.Street}, ${address.House || ''}, ${address.Body || ''}`;
                if (addressSet.has(addressString)) {
                    return true;
                }
                addressSet.add(addressString);
                return false;
                });

                if (duplicateAddress) {
                    return res.status(401).json({ success: false, message: 'Обнаружены совпадающие адреса' });
                }
           
            // Преобразование массива в строку для SQL-запроса
            const valuesString = AddressesData.map(addr => 
              `('${addr.Name}', '${addr.Street}', ${addr.House}, ${addr.Body}, ${addr.AddressOrder})`
            ).join(', ');
            const Order_number =  faker.number.int({ min: 10000000, max: 99999999 }); 
            const Path_lenght =  null;
            const Travel_time =  null;
            const Cost = null;
            const Type_of_order_statusesID = 1;
            const currentDate = new Date().toISOString().split('T')[0]; 
            await sql.connect(config);
            const request = new sql.Request();
            request.input('CurrentDate', sql.Date, currentDate);
            //request.input('AddresessUnique', sql.NVarChar, valuesString);

            const result = await request.query(`
                    DECLARE @AddressesData AddressType;

                    INSERT INTO @AddressesData (Name, Stret, House, Body, AddressOrder)
                    VALUES ${valuesString};

                    EXEC CreateOrderbyType @ClientID=${ClientID},
                    @Order_number=${Order_number},
                    @Cost=${Cost},
                    @Path_lenght=${Path_lenght},
                    @Travel_time=${Travel_time},
                    @Type_of_paymentID=${Type_of_paymentID},
                    @Types_of_orderID=${Types_of_orderID},
                    @Date_of_receipt_of_the_status='${currentDate}',
                    @Type_of_order_statusesID=${Type_of_order_statusesID},
                    @AddressesData=@AddressesData,
                    @Number_of_passengers=${Number_of_passengers},
                    @class_of_serviceID=${class_of_serviceID},
                    @Cargo_weight=${Cargo_weight},
                    @Dimensions_of_the_cargo=${Dimensions_of_the_cargo},
                    @Type_of_cargoID=${Type_of_cargoID}`);


                        res.json({
                            success: true,
                            message: `Заказ успешно создан. \n №: ${Order_number}`,
                            ...result.recordsets
                        });
            
        }catch (err) {
        console.error('Ошибка при создании заказа', err);
        res.status(500).json({
            success: false,
            message: 'Ошибка при создании заказа',
        });
    } finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
});


app.get('/OrderDetails/classOfService', async(req, res) => {
    try {
        await sql.connect(config);

        const result = await sql.query(`
            SELECT TOP (100)
                    [Name]
             FROM class_of_service
        `);
        res.json({
            success: true,
            ...result.recordsets
        });
    } catch (err) {
        console.error('Ошибка при получении деталей заказов: ', err);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении деталей заказов',
        });
    } finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
});

app.get('/OrderDetails/typeOfCargo', async(req, res) => {
    try {
        await sql.connect(config);
        const result = await sql.query(`
              SELECT TOP (100)
                    [ID], [Name]
            FROM Type_of_cargo
        `);
        res.json({
            success: true,
            ...result.recordsets
        });
    } catch (err) {
        console.error('Ошибка при получении деталей заказов: ', err);
        res.status(500).json({
            success: false,
            message: 'Ошибка при получении деталей заказов',
        });
    } finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
});

const formattedAddresses = (usedAddresses) => {
    return usedAddresses.map((address) => {
      // Формируем строку адреса, убирая пробелы в конце и объединяя компоненты адреса
      const label = `${address.Name}, ${address.Stret}, ${address.House}${address.Body ? ', ' + address.Body.trim() : ''}`;
      return { label };
    });
  }
  
  app.get('/GetUserAdresses/:UserID', checkAuth, async(req, res) => {
    try {
      const UserId = req.params.UserID;
      if (!isNaN(UserId) && !isNaN(parseFloat(UserId))) {
        await sql.connect(config);
  
        // Вызов хранимой процедуры с передачей параметров
        const result = await sql.query`exec GetUserUsedAddresses 
          @UserID = ${UserId};`;
  
        if (!isNaN(result.recordsets[0])) {
          return res.status(200).json({ success: true, data: false, message: 'Адреса не найдены' });
        } else {
          // Преобразуем результат запроса с помощью функции formattedAddresses
          const formattedResult = formattedAddresses(result.recordsets[0]);
  
          res.json({
            success: true,
            data: true,
            message: 'Данные заказов успешно получены.',
            addresses: formattedResult // Возвращаем преобразованный массив адресов
          });
        }
      } else {
        return res.status(401).json({ success: false, message: 'Неверный тип данных пользователя' });
      }
    } catch (err) {
      console.error('Ошибка при получении адресов клиента:', err);
      res.status(500).json({
        success: false,
        message: 'Ошибка при получении адресов клиента',
      });
    } finally {
      // Закрытие соединения с базой данных
      await sql.close();
    }
  });
  
    

app.get('/', (req, res) =>{
    res.send('hello world')
    
});


app.listen(4444, (err) => {
    if (err){
        return console.log(err);
    }

    console.log('server ok');
});
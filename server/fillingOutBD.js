import sql from 'mssql'
import { faker, fakerRU } from '@faker-js/faker';


var config = {
    "user": "pupu", // Database username
    "password": "qwerty123", // Database password
    "server": "OPTION", // Server IP address
    "database": "Auto_transportation_company", // Database name
    "options": {
        "encrypt": false // Disable encryption
    }
}

function getRandomNumberOrNull(max, nullProbability) {
    const randomNumber = Math.random();
    if (randomNumber < nullProbability) {
        return null;
    } else {
        return Math.floor(randomNumber * max) + 1;
    }
}

// Пример использования
// const randomValue = getRandomNumberOrNull(5, 0.2); // Вероятность `null` равна 20%

// console.log(randomValue);



sql.connect(config, err => {
    if (err) {
        throw err;
    }
    console.log("BD ok");
    
});

async function fillingUser(n) {
    
    await sql.connect(config);

        // SQL-запрос для получения пользователя по email

        try {
            // Генерация и вставка тестовых данных для 10 клиентов
            for (let i = 0; i < n; i++) {
                
             const Full_name =  fakerRU.person.fullName();
             let Telephone =  fakerRU.phone.number();
             let Email =  (Math.floor(Math.random() * 100) + 1) + (Math.floor(Math.random() * 100) + 1)+(faker.internet.email());
             const Password =  faker.internet.password();
             const Data_birtday =  faker.date.past({ years: 80 });
                
                await sql.query`EXEC AddClient @Full_name = ${Full_name}, @Telephone = ${Telephone}, @Email = ${Email}, @Password = ${Password}, @Data_birtday = ${Data_birtday}`;
            }
    
            console.log('Тестовые данные успешно добавлены.');
        } catch (err) {
            console.error('Ошибка при добавлении тестовых данных:', err);
        }
     finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
}


async function fillingAdress(n) {
    
    await sql.connect(config);

        // SQL-запрос для получения пользователя по email

        try {
            // Генерация и вставка тестовых данных для 10 клиентов
            for (let i = 0; i < n; i++) {
                
                const Name =  faker.lorem.words()+faker.number.int({ min: 1, max:  100});
                const Stret =  fakerRU.location.street();
                const House =  faker.location.buildingNumber();
                const Body =  faker.location.buildingNumber();
                    
                await sql.query`insert into Addresses (Name, Stret, House, Body)  
                values (${Name}, ${Stret}, ${House}, ${Body})`;
            }
    
            console.log('Тестовые данные успешно добавлены.');
        } catch (err) {
            console.error('Ошибка при добавлении тестовых данных:', err);
        }
     finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
}


async function fillingReviews(n) {
    
    await sql.connect(config);

        // SQL-запрос для получения пользователя по email

        try {
            // Генерация и вставка тестовых данных для 10 клиентов
            for (let i = 0; i < n; i++) {
                const num = getRandomNumberOrNull(5,0.5)
                let description = null;
                if (num!=null)
                    description = fakerRU.lorem.words(num);
                const Evaluation = Math.floor(Math.random() * 5) + 1;

                await sql.query`insert into Reviews(description, Evaluation)  
                values (${description}, ${Evaluation})`;
            }
    
            console.log('Тестовые данные успешно добавлены.');
        } catch (err) {
            console.error('Ошибка при добавлении тестовых данных:', err);
        }
     finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
}

async function fillingOrders(init, n,us) {
    
    await sql.connect(config);

        // SQL-запрос для получения пользователя по email

        try {
            const knum =  faker.number.int({ min: 10000000, max: 99999999 }); 
            // Генерация и вставка тестовых данных для 10 клиентов
            for (let i = init; i < n; i++) {

                //order  Math.floor(Math.random() * 100) + 1 faker.number.int({ min: 10000000, max: 99999999 }); 
                const Order_number =  knum++;
                const Cost = faker.finance.amount({ min: 50, max: 2000, dec: 2 });
                const Path_lenght =  faker.number.float({ min: 1, max: 65, fractionDigits: 2 });
                const Travel_time =  faker.number.int({ min: 0, max: 23 })+':'+faker.number.int({ min: 0, max: 59 });
                const Type_of_paymentID = faker.number.int({ min: 1, max: 2});
                const ClientID =  faker.number.int({ min: 1, max: us });
                const ReviewsID = getRandomNumberOrNull(210540, 0.7);
                const Types_of_orderID =  faker.number.int({ min: 1, max: 2});

                await sql.query`
                insert into Orders (Order_number, Cost, Path_lenght, Travel_time, Type_of_paymentID, ClientID, ReviewsID, Types_of_orderID)
                values (${Order_number}, ${Cost}, ${Path_lenght}, ${Travel_time}, ${Type_of_paymentID}, ${ClientID}, ${ReviewsID}, ${Types_of_orderID})`;

                const OrderID = i
                
                //Passenger_order
                if (Types_of_orderID == 1){
                const Number_of_passengers = faker.number.int({ min: 1, max: 8 });
                const class_of_serviceID = faker.number.int({ min: 1, max: 4 });

                await sql.query`
                insert into Passenger_order(Number_of_passengers, class_of_serviceID, OrderID)
                values (${Number_of_passengers}, ${class_of_serviceID}, ${OrderID})`;

                //Cargo_order
                } else if(Types_of_orderID == 2){
                const Cargo_weight = faker.number.float({ min: 0, max: 500, fractionDigits: 2 });
                const Dimensions_of_the_cargo = faker.number.int({ min: 1, max:  16})+'х'+faker.number.int({ min: 1, max:  16})+'х'+faker.number.int({ min: 1, max:  16});
                const Type_of_cargoID =  faker.number.int({ min: 1, max: 4 });

                await sql.query`
                insert into Cargo_order(Cargo_weight, Dimensions_of_the_cargo, Type_of_cargoID, OrderID) 
                values (${Cargo_weight}, ${Dimensions_of_the_cargo}, ${Type_of_cargoID}, ${OrderID})`;
                }


                //Order_status_history  
                const Number = 1;
                const Date_of_receipt_of_the_status = faker.date.past({ years: 30 });
                const Type_of_order_statusesID = faker.number.int({ min: 1, max:  3});
                
                await sql.query`
                insert into Order_status_history(Number, Date_of_receipt_of_the_status, Type_of_order_statusesID, OrderID)
                values (${Number}, ${Date_of_receipt_of_the_status}, ${Type_of_order_statusesID}, ${OrderID})`;

                for (let j = 1; j < faker.number.int({ min: 3, max: 5}); j++){
                    const Number = j;
                    const AddressesID = faker.number.int({ min: 1, max:  210000});
                    await sql.query`
                    insert into The_order_of_addresses(Number, AddressesID, OrderID)  
                    values (${Number}, ${AddressesID}, ${OrderID})`;
                }
                
            }
    
            console.log('Тестовые данные успешно добавлены.');
        } catch (err) {
            console.error('Ошибка при добавлении тестовых данных:', err);
        }
     finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
}

async function fillingOrdersByUser(init, id, count) {
    
    await sql.connect(config);


        try {
            let knum =  faker.number.int({ min: 10000000, max: 99999999 }); 

            for (let i = init; i < count; i++) {

                //order
                const Order_number =  knum++;
                const Cost = faker.finance.amount({ min: 50, max: 10000, dec: 2 });
                const Path_lenght =  faker.number.float({ min: 1, max: 100, fractionDigits: 2 });
                const Travel_time =  faker.number.int({ min: 0, max: 23 })+':'+faker.number.int({ min: 0, max: 59 });
                const Type_of_paymentID = faker.number.int({ min: 1, max: 2});
                const ClientID =  id;
                const ReviewsID = getRandomNumberOrNull(210540, 0.5);
                const Types_of_orderID =  faker.number.int({ min: 1, max: 2});

                await sql.query`
                insert into Orders (Order_number, Cost, Path_lenght, Travel_time, Type_of_paymentID, ClientID, ReviewsID, Types_of_orderID)
                values (${Order_number}, ${Cost}, ${Path_lenght}, ${Travel_time}, ${Type_of_paymentID}, ${ClientID}, ${ReviewsID}, ${Types_of_orderID})`;

                let OrderID = i;

                //Passenger_order
                if (Types_of_orderID == 1){
                const Number_of_passengers = faker.number.int({ min: 1, max: 8 });
                const class_of_serviceID = faker.number.int({ min: 1, max: 4 });

                await sql.query`
                insert into Passenger_order(Number_of_passengers, class_of_serviceID, OrderID)
                values (${Number_of_passengers}, ${class_of_serviceID}, ${OrderID})`;

                //Cargo_order
                } else if(Types_of_orderID == 2){
                const Cargo_weight = faker.number.float({ min: 0, max: 500, fractionDigits: 2 });
                const Dimensions_of_the_cargo = faker.number.int({ min: 4, max:  512});
                const Type_of_cargoID =  faker.number.int({ min: 1, max: 4 });

                await sql.query`
                insert into Cargo_order(Cargo_weight, Dimensions_of_the_cargo, Type_of_cargoID, OrderID) 
                values (${Cargo_weight}, ${Dimensions_of_the_cargo}, ${Type_of_cargoID}, ${OrderID})`;
                }


                //Order_status_history  
                const Date_of_receipt_of_the_status = faker.date.past({ years: 30 });
                const Type_of_order_statusesID = faker.number.int({ min: 1, max:  3});
                
                await sql.query`
                insert into Order_status_history(Number, Date_of_receipt_of_the_status, Type_of_order_statusesID, OrderID)
                values (${1}, ${Date_of_receipt_of_the_status}, ${Type_of_order_statusesID}, ${OrderID})`;

                for (let j = 1; j < faker.number.int({ min: 3, max: 5}); j++){
                    const Number = j;
                    const AddressesID = faker.number.int({ min: 1, max:  210000});
                    await sql.query`
                    insert into The_order_of_addresses(Number, AddressesID, OrderID)  
                    values (${Number}, ${AddressesID}, ${OrderID})`;
                }
                
            }
    
            console.log('Тестовые данные успешно добавлены.');
        } catch (err) {
            console.error('Ошибка при добавлении тестовых данных:', err);
        }
     finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
}

function parseAddress(address) {
    // Regular expression to match the address parts
    const regex = /^(.*?),\s*(\d+),\s*(\d+)$/;
    const match = address.match(regex);

    if (match) {
        const [ , Stret, House, Body] = match;
        return {
            Stret: Stret.trim(),
            House: parseInt(House, 10),
            Body: parseInt(Body, 10)
        };
    } else {
        throw new Error('Address format is incorrect. Expected format: "Stret, House, Body"');
    }
}

// Example usage
// try {
//     const address = "Main Street, 123, 4";
//     const parsedAddress = parseAddress(address);
//     console.log(parsedAddress);
//     // Output: { Stret: 'Main Street', House: 123, Body: 4 }
// } catch (error) {
//     console.error(error.message);
// }


async function test1() {
    
    await sql.connect(config);


        try {

                
                const res = await sql.query`
                SELECT TOP (1000)
                    [Name]
                FROM Type_of_cargo

                SELECT TOP (1000)
                    [Name]
                FROM class_of_service`;

                console.log(res)
            
    
            console.log('успешно.');
        } catch (err) {
            console.error('Ошибка:', err);
        }
     finally {
        // Закрытие соединения с базой данных
        await sql.close();
    }
}

//fillingUser(200000);
//fillingAdress(200000);
//fillingThe_order_of_addresses();
//fillingReviews(100000);
//fillingOrders(72789, 100000, 187589);
fillingOrdersByUser(89115, 188623, 89125);
//test1();

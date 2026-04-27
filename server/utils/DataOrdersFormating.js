const DataOrdersFormating = (Data) => {
    return Data.map(record => {
        if (record.Type_of_order === 'cargo') {
            record.Type_of_order = 'Грузовой';
        } else if (record.Type_of_order === 'passenger') {
            record.Type_of_order = 'Пассажирский';
        }
        if (record.Type_of_payment === 'bank card') {
            record.Type_of_payment = 'Банковкая карта';
        } else if (record.Type_of_payment === 'cash') {
            record.Type_of_payment = 'Наличные';
        }
        if (record.Type_of_order_statuses === 'canceled') {
            record.Type_of_order_statuses = 'Отмененный';
        } else if (record.Type_of_order_statuses === 'completed') {
            record.Type_of_order_statuses = 'Завершенный';
        } else if (record.Type_of_order_statuses === 'in progress') {
            record.Type_of_order_statuses = 'В обработке';
        } else if (record.Type_of_order_statuses === 'not completed') {
            record.Type_of_order_statuses = 'Не завершенный';
        }

       
        const travelTime = new Date(record.Travel_time);
        record.Travel_time = travelTime.toLocaleTimeString('ru-RU', { hour12: false });

        if(record.Date_of_receipt_of_the_status != undefined && record.Date_of_receipt_of_the_status != null){
        const dateOfReceipt = new Date(record.Date_of_receipt_of_the_status);
        record.Date_of_receipt_of_the_status = dateOfReceipt.toLocaleDateString('ru-RU');
        }

        record.StartAddress = record.StartAddress.replace(/\s{2,}/g, ' ');
        record.EndAddress = record.EndAddress.replace(/\s{2,}/g, ' ');
        if(record.IntermediateAddresses != undefined)
            record.IntermediateAddresses = record.IntermediateAddresses.replace(/\s{2,}/g, ' ');


        return record;
    });
};

export default DataOrdersFormating;
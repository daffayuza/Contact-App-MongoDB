const mongoose = require('mongoose')
const dbName = 'app-contact'

mongoose.connect(`mongodb+srv://daffa:daffa123@cluster0.sfngnqq.mongodb.net/${dbName}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});

// // menambahkan 1 data
// const contact1 = new contact({
//     nama: 'Azizi',
//     nohp: '08345374',
//     email: 'azizi@gmail.com'
// })

// // simpan ke collection
// contact1.save().then((contact) => console.log(contact))
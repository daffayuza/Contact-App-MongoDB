const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult, check } = require('express-validator');
const methodOverride = require('method-override');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const Contact = require('./model/contact');

require('dotenv').config();

const app = express();
const port = 3000;

// Setup Method Override
app.use(methodOverride('_method'));

// Setup ejs
app.set('view engine', 'ejs');
app.use(expressLayouts);
app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser('secret'));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// halaman home
app.get('/', (req, res) => {
  const mahasiswa = [
    {
      nama: 'Daffa',
      email: 'daffa@gmail.com',
    },
    {
      nama: 'Freya',
      email: 'Freya@gmail.com',
    },
    {
      nama: 'Azizi',
      email: 'Azizi@gmail.com',
    },
  ];
  res.render('index', {
    nama: 'Freyaa Jayawardana',
    title: 'Halaman Home',
    mahasiswa,
    layout: 'layouts/main-layouts',
  });
});

// halaman about
app.get('/about', (req, res) => {
  res.render('about', {
    layout: 'layouts/main-layouts',
    title: 'Halaman About',
  });
});

// halaman contact
app.get('/contact', async (req, res) => {
  const contacts = await Contact.find();

  res.render('contact', {
    layout: 'layouts/main-layouts',
    title: 'Halaman Contact',
    contacts,
    msg: req.flash('msg'),
  });
});

// halaman form tambah data contact
app.get('/contact/add', (req, res) => {
  res.render('add-contact', {
    layout: 'layouts/main-layouts',
    title: 'Form Tambah Data Contact',
  });
});

// proses tambah data contact
app.post(
  '/contact',
  [
    body('nama').custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (duplikat) {
        throw new Error('Nama contact sudah digunakan!');
      }
      return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('nohp', 'No HP tidak valid!').isMobilePhone('id-ID'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('add-contact', {
        layout: 'layouts/main-layouts',
        title: 'Form Tambah Data Contact',
        errors: errors.array(),
      });
    } else {
      try {
        const result = await Contact.create(req.body);
        // kirimkan flash message
        req.flash('msg', 'Data contact berhasil ditambahkan!');
        res.redirect('/contact');
      } catch (error) {
        // Tangani kesalahan jika terjadi saat menyisipkan data
        console.error(error);
        // Tambahkan log atau tindakan lain sesuai kebutuhan
        res.status(500).send('Internal Server Error');
      }
    }
  }
);


// Proses Delete Contact
app.delete('/contact', (req, res) => {
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash('msg', 'Data contact berhasil dihapus!');
    res.redirect('/contact');
  })
});

// Halaman form ubah Contact
app.get('/contact/edit/:nama', async (req, res) => {
  const contact = await Contact.findOne({nama: req.params.nama})

  res.render('update-contact', {
    layout: 'layouts/main-layouts',
    title: 'Form Ubah Data Contact',
    contact
  });
});

// Proses Update Contact
app.put(
  '/contact',
  [
    body('nama').custom( async (value, {req} )=> {
      const duplikat = await Contact.findOne({ nama: value });
      if (value !== req.body.oldName && duplikat) {
        throw new Error('Nama contact sudah digunakan!');
      }
      return true;
    }),
    check('email', 'Email tidak valid!').isEmail(),
    check('nohp', 'No HP tidak valid!').isMobilePhone('id-ID'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render('update-contact', {
        layout: 'layouts/main-layouts',
        title: 'Form Ubah Data Contact',
        errors: errors.array(),
        contact: req.body
      });
    } else {
       Contact.updateOne(
        { 
          _id: req.body._id
        },
        {
          $set: {
            nama: req.body.nama,
            email: req.body.email,
            nohp: req.body.nohp,
          }
        } 
        ).then((result) => {
         // kirimkan flash message
         req.flash('msg', 'Data contact berhasil diubah!')
         res.redirect('/contact');
       })
    }
  }
);

// halaman detail Contact
app.get('/contact/:nama', async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });

  res.render('detail', {
    layout: 'layouts/main-layouts',
    title: 'Halaman Detail Contact',
    contact,
  });
});

app.listen(port, () => {
  console.log(`Mongo Contact App || listening at http://localhost:${port}`);
});

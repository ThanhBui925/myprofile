require('dotenv').config();
const mongoose = require('mongoose');
const Company = require('./src/models/Company');

async function updateCompany() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const company = await Company.findOne();
    if (company) {
      const appName = process.env.APP_NAME || 'THANHTDH';
      
      const replaceName = (text) => text ? text.replace(/ERATECH|THANHTDH/gi, appName) : text;
      
      company.nameVi = company.nameVi || appName;
      company.nameEn = company.nameEn || appName;

      company.aboutVi = replaceName(company.aboutVi);
      company.aboutEn = replaceName(company.aboutEn);
      
      if (company.history) {
        company.history = company.history.map(item => {
          item.descriptionVi = replaceName(item.descriptionVi);
          item.descriptionEn = replaceName(item.descriptionEn);
          return item;
        });
      }

      await company.save();
      console.log('Company texts updated successfully');
    }
  } catch (err) {
    console.error(err);
  } finally {
    process.exit(0);
  }
}

updateCompany();

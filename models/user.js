var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');

// create a sequelize instance with our postgres database information.
var sequelize = new Sequelize('d8qspi9bf1ncj3', 'rdythibocmspfq', '28d97c027abdd748c1b93c11b7063de6ff4106acd6fa3d6df24559913283f536', {
  dialect: 'postgres',
  host: 'ec2-54-247-101-191.eu-west-1.compute.amazonaws.com',
  port: 5432,
  dialectOptions: {
    ssl: true
  }
})

// setup User model and its fields.
var User = sequelize.define('users', {
    username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    }
}, {
    hooks: {
      beforeCreate: (user) => {
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(user.password, salt);
      }
    }  
});
User.prototype.validPassword = function(password) {
        return bcrypt.compareSync(password, this.password);
      };

// create all the defined tables in the specified database.
sequelize.sync()
    .then(() => console.log('users table has been successfully created, if one doesn\'t exist'))
    .catch(error => console.log('This error occured', error));

// export User model for use in other files.
module.exports = User;
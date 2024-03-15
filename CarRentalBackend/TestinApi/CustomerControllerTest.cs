using CarRentalBackend.Controllers;
using CarRentalBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;


namespace WEBAPITEST
{
    public class CustomerControllerTest
    {
        private IConfiguration config;

        [SetUp]
        public void Setup()
        {
            config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
        }
        [Test]
        public async Task PostMethodForCustomer()
        {
            var options = new DbContextOptionsBuilder<NewRoadReadyContext>().UseSqlServer(config.GetConnectionString("MyConnection")).Options;
            using var context = new NewRoadReadyContext(options);
            await context.Database.EnsureCreatedAsync();
            var customerCtr = new CustomersController(context);
            var newCustomer = new Customer()
            {
                FirstName = "Anu",
                LastName = "Shri",
                EmailAddress = "anu@gmail.com",
                Password = "anu@123",
                RePassword = "anu@123",
                PhoneNumber = "857613456",
                Address = "Bangalore,Karnataka",
                LicenseNumber = "KA5823HJ783456",
                Role = "Customer",
                Gender = "Female"
            };
            // Act
            var result = await customerCtr.PostCustomer(newCustomer);
            // Assert
            Assert.IsNotNull(result);
            var actualCustomer = await context.Customers.FirstOrDefaultAsync(e => e.EmailAddress == newCustomer.EmailAddress);
            Assert.AreEqual(newCustomer.FirstName, actualCustomer.FirstName);
            Assert.AreEqual(newCustomer.LastName, actualCustomer.LastName);
            Assert.AreEqual(newCustomer.EmailAddress, actualCustomer.EmailAddress);
            Assert.AreEqual(newCustomer.Password, actualCustomer.Password);
            Assert.AreEqual(newCustomer.RePassword, actualCustomer.RePassword);
            Assert.AreEqual(newCustomer.PhoneNumber, actualCustomer.PhoneNumber);
            Assert.AreEqual(newCustomer.Address, actualCustomer.Address);
            Assert.AreEqual(newCustomer.LicenseNumber, actualCustomer.LicenseNumber);
            Assert.AreEqual(newCustomer.Role, actualCustomer.Role);
            Assert.AreEqual(newCustomer.Gender, actualCustomer.Gender);
        }

        [Test]
        public async Task UpdateCustomer()
        {
            var options = new DbContextOptionsBuilder<NewRoadReadyContext>().UseSqlServer(config.GetConnectionString("MyConnection")).Options;

            using var context = new NewRoadReadyContext(options);
            context.Database.EnsureCreated();
            var customerCtr = new CustomersController(context);
            int customerId = 14;
            var updatedCustomer = new Customer
            {
                CustomerId = customerId,
                FirstName = "Priya",
                LastName = "Varma",
                EmailAddress = "priya@gmail.com",
                Password = "priya@123",
                RePassword = "priya@123",
                PhoneNumber = "907613456",
                Address = "Coimbatore,Tamilnadu",
                LicenseNumber = "TN4423HJ783456",
                Role = "Customer",
                Gender = "Female"
            };
            await customerCtr.PutCustomer(customerId, updatedCustomer);
            var retrievedCustomer = await context.Customers.FindAsync(customerId);
            Assert.IsNotNull(retrievedCustomer);
            Assert.AreEqual("Priya", retrievedCustomer.FirstName);
            Assert.AreEqual("Varma", retrievedCustomer.LastName);
            Assert.AreEqual("priya@gmail.com", retrievedCustomer.EmailAddress);
            Assert.AreEqual("priya@123", retrievedCustomer.Password);
            Assert.AreEqual("priya@123", retrievedCustomer.RePassword);
            Assert.AreEqual("907613456", retrievedCustomer.PhoneNumber);
            Assert.AreEqual("Coimbatore,Tamilnadu", retrievedCustomer.Address);
            Assert.AreEqual("TN4423HJ783456", retrievedCustomer.LicenseNumber);
            Assert.AreEqual("Female", retrievedCustomer.Gender);
        }
        [Test]
        public async Task GetCustomerById()
        {
            var options = new DbContextOptionsBuilder<NewRoadReadyContext>().UseSqlServer(config.GetConnectionString("MyConnection")).Options;
            using var context = new NewRoadReadyContext(options);
            context.Database.EnsureCreated();
            var customerCtr = new CustomersController(context);
            int customerId = 4;
            var result = await customerCtr.GetCustomer(customerId);
            Assert.IsInstanceOf<ActionResult<Customer>>(result);
        }
        [Test]
        public async Task DelCustomer()
        {
            var options = new DbContextOptionsBuilder<NewRoadReadyContext>().UseSqlServer(config.GetConnectionString("MyConnection")).Options;
            using var context = new NewRoadReadyContext(options);
            context.Database.EnsureCreated();
            var customerCtr = new CustomersController(context);
            int idToDelete = 15;
            await customerCtr.DeleteCustomer(idToDelete);
            var deletedCustomer = await context.Customers.FindAsync(idToDelete);
            Assert.IsNull(deletedCustomer, "Customer should have been deleted.");
        }

        [Test]
        public void GetCustomer()
        {

            var options = new DbContextOptionsBuilder<NewRoadReadyContext>().UseSqlServer(config.GetConnectionString("MyConnection")).Options;
            using var context = new NewRoadReadyContext(options);
            context.Database.EnsureCreated();
            var proCtr = new CustomersController(context);
            var newPro = new Customer()
            {
                FirstName = "Anu",
                LastName = "Shri",
                EmailAddress = "anu@gmail.com",
                Password = "anu@123",
                RePassword = "anu@123",
                PhoneNumber = "857613456",
                Address = "Bangalore,Karnataka",
                LicenseNumber = "KA5823HJ783456",
                Role = "Customer",
                Gender = "Female"
            };
            var actPro = context.Customers.FirstOrDefault(p => p.EmailAddress == "anu@gmail.com");
            proCtr.PostCustomer(newPro);
            Assert.IsNotNull(actPro);
            Assert.AreEqual(newPro.FirstName, actPro.FirstName);
            Assert.AreEqual(newPro.LastName, actPro.LastName);
            Assert.AreEqual(newPro.EmailAddress, actPro.EmailAddress);
            Assert.AreEqual(newPro.Password, actPro.Password);
            Assert.AreEqual(newPro.RePassword, actPro.RePassword);
            Assert.AreEqual(newPro.Address, actPro.Address);
            Assert.AreEqual(newPro.LicenseNumber, actPro.LicenseNumber);
            Assert.AreEqual(newPro.Role, actPro.Role);
            Assert.AreEqual(newPro.Gender, actPro.Gender);
            Assert.Pass();

        }

    }
}

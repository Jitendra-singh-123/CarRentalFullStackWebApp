using CarRentalBackend.Controllers;
using CarRentalBackend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace WEBAPITEST
{
    public class AdminControllerTest
    {
        private IConfiguration config;

        [SetUp]
        public void Setup()
        {
            config = new ConfigurationBuilder().AddJsonFile("appsettings.json").Build();
        }

        [Test]
        public async Task PostMethodForAdmin()
        {
            // Arrange
            var options = new DbContextOptionsBuilder<NewRoadReadyContext>()
                .UseSqlServer(config.GetConnectionString("MyConnection"))
                .Options;

            using var context = new NewRoadReadyContext(options);
            await context.Database.EnsureCreatedAsync(); // Ensure database is created asynchronously

            var adminController = new AdminsController(context);
            var newAdmin = new Admin
            {
                FirstName = "Vignesh",
                LastName = "Kumar",
                Password = "vicky@123",
                RePassword = "vicky@123",
                Email = "vicky@gmail.com",
                Address = "Chennai,Tamilnadu",
                Role = "Admin",
                Gender = "Male"
            };

            // Act
            var result = await adminController.PostAdmin(newAdmin);

            // Assert
            Assert.IsNotNull(result);


            Admin actualAdmin = await context.Admins.FirstOrDefaultAsync(e => e.Email == newAdmin.Email);
            Assert.IsNotNull(actualAdmin);

            Assert.AreEqual(newAdmin.FirstName, actualAdmin.FirstName);
            Assert.AreEqual(newAdmin.LastName, actualAdmin.LastName);
            Assert.AreEqual(newAdmin.Password, actualAdmin.Password);
            Assert.AreEqual(newAdmin.RePassword, actualAdmin.RePassword);
            Assert.AreEqual(newAdmin.Email, actualAdmin.Email);
            Assert.AreEqual(newAdmin.Address, actualAdmin.Address);
            Assert.AreEqual(newAdmin.Role, actualAdmin.Role);
            Assert.AreEqual(newAdmin.Gender, actualAdmin.Gender);
        }

        [Test]
        public async Task UpdateAdmin()
        {
            var options = new DbContextOptionsBuilder<NewRoadReadyContext>().UseSqlServer(config.GetConnectionString("MyConnection")).Options;

            using var context = new NewRoadReadyContext(options);
            context.Database.EnsureCreated();
            var adminCtr = new AdminsController(context);
            int adminId = 12;
            var updatedAdmin = new Admin
            {
                AdminId = adminId,
                FirstName = "Sradha",
                LastName = "Kapoor",
                Password = "sradha12",
                RePassword = "sradha12",
                Email = "sradha@gmail.com",
                Address = "Ernakulam,Kerala",
                Role = "Admin",
                Gender = "Female"
            };
            await adminCtr.PutAdmin(adminId, updatedAdmin);
            var retrievedAdmin = await context.Admins.FindAsync(adminId);
            Assert.IsNotNull(retrievedAdmin);
            Assert.AreEqual("Sradha", retrievedAdmin.FirstName);
            Assert.AreEqual("Kapoor", retrievedAdmin.LastName);
            Assert.AreEqual("sradha12", retrievedAdmin.Password);
            Assert.AreEqual("sradha12", retrievedAdmin.RePassword);
            Assert.AreEqual("sradha@gmail.com", retrievedAdmin.Email);
            Assert.AreEqual("Ernakulam,Kerala", retrievedAdmin.Address);
            Assert.AreEqual("Female", retrievedAdmin.Gender);
        }

        [Test]
        public async Task GetAdminById()
        {
            var options = new DbContextOptionsBuilder<NewRoadReadyContext>().UseSqlServer(config.GetConnectionString("MyConnection")).Options;
            using var context = new NewRoadReadyContext(options);
            context.Database.EnsureCreated();
            var adminCtr = new AdminsController(context);
            int adminId = 5;
            var result = await adminCtr.GetAdmin(adminId);
            Assert.IsInstanceOf<ActionResult<Admin>>(result);
        }
        [Test]
        public async Task DelAdmin()
        {
            var options = new DbContextOptionsBuilder<NewRoadReadyContext>().UseSqlServer(config.GetConnectionString("MyConnection")).Options;
            using var context = new NewRoadReadyContext(options);
            context.Database.EnsureCreated();
            var adminCtr = new AdminsController(context);
            int idToDelete = 11;
            await adminCtr.DeleteAdmin(idToDelete);
            var deletedAdmin = await context.Admins.FindAsync(idToDelete);
            Assert.IsNull(deletedAdmin, "Admin should have been deleted.");
        }

        [Test]
        public void GetAdmin()
        {

            var options = new DbContextOptionsBuilder<NewRoadReadyContext>().UseSqlServer(config.GetConnectionString("MyConnection")).Options;
            using var context = new NewRoadReadyContext(options);
            context.Database.EnsureCreated();
            var proCtr = new AdminsController(context);
            var newPro = new Admin() {
                FirstName = "Vignesh",
                LastName = "Kumar",
                Password = "vicky@123",
                RePassword = "vicky@123",
                Email = "vicky@gmail.com",
                Address = "Chennai,Tamilnadu",
                Role = "Admin",
                Gender = "Male"
            };
            var actPro = context.Admins.FirstOrDefault(p => p.Email == "vicky@gmail.com");
            proCtr.PostAdmin(newPro);
            Assert.IsNotNull(actPro);
            Assert.AreEqual(newPro.FirstName, actPro.FirstName);
            Assert.AreEqual(newPro.LastName, actPro.LastName);
            Assert.AreEqual(newPro.Password, actPro.Password);
            Assert.AreEqual(newPro.RePassword, actPro.RePassword);
            Assert.AreEqual(newPro.Email, actPro.Email);
            Assert.AreEqual(newPro.Address, actPro.Address);
            Assert.AreEqual(newPro.Role, actPro.Role);
            Assert.AreEqual(newPro.Gender,actPro.Gender);
            Assert.Pass();

        }
    }
}
// import { PrismaClient, Role } from '@prisma/client';
// const prisma = new PrismaClient();

// async function main() {
//   // Seeding Users
//   for (let i = 1; i <= 10; i++) {
//     await prisma.user.create({
//       data: {
//         id: `user${i}`,
//         firstName: `First Name${i}`,
//         lastName: `last Name${i}`,
//         email: `user${i}@example.com`,
//         password: `password${i}`, // Ensure hashed passwords in production
//         phone: `123-456-789${i}`,
//         address: `Address ${i}`
//       },
//     });
//   }

//   // Seeding Pets
//   for (let i = 1; i <= 10; i++) {
//     await prisma.pet.create({
//       data: {
//         name: `Pet Name${i}`,
//         type: `Type${i}`,
//         breed: `Breed${i}`,
//         img: `https://example.com/pet${i}.jpg`,
//         bloodType: i % 2 === 0 ? "A+" : "B+",
//         sex: i % 2 === 0 ? "MALE" : "FEMALE",
//         owner: { connect: { id: `user${i}` } }, // Assigning each pet to a user
//         birthday: new Date(new Date().setFullYear(new Date().getFullYear()-2)),
//       },
//     });
//   }

//   // Seeding Services
//   const servicesData = [
//     {name: "Checkup", description: "Routine health check", duration: 30, price: 50.0 },
//     {name: "Vaccination", description: "Vaccines for pets", duration: 20, price: 40.0 },
//     {name: "Dental Cleaning", description: "Teeth cleaning", duration: 45, price: 60.0 },
//     {name: "Grooming", description: "Full grooming service", duration: 60, price: 55.0 },
//     {name: "Surgery", description: "Basic pet surgery", duration: 120, price: 300.0 },
//     {name: "X-ray", description: "Radiography service", duration: 45, price: 100.0 },
//     {name: "Weight Management", description: "Diet consultation", duration: 60, price: 75.0 },
//     {name: "Behavior Consultation", description: "Behavioral analysis", duration: 90, price: 120.0 },
//     {name: "Emergency Care", description: "Emergency treatment", duration: 60, price: 150.0 },
//     {name: "Neutering", description: "Spaying/neutering service", duration: 90, price: 200.0 }
//   ];

//   for (const service of servicesData) {
//     await prisma.service.create({ data: service });
//   }
//   // Seeding Appointments
//   for (let i = 1; i <= 10; i++) {
//     await prisma.appointment.create({
//       data: {
//         pet: { connect: { id: i } },
//         user: { connect: { id: `user${i}` } },
//         service: { connect: { id: (i % 4) + 1 } },
//         date: new Date(),
//         status: "Scheduled",
//         notes: `Appointment for Pet${i}`
//       },
//     });
//   }
  
//   // Seeding Admin
//   await prisma.admin.create({
//     data: {
//       id: "admin1",
//       username: "admin1",
//       password: "adminpass1", // Ensure hashed passwords in production
//       email: "admin1@example.com",
//     },
//   });
  
//   // Seeding Clinic Information
//   await prisma.clinicInfo.create({
//     data: {
//       name: "Tapales Veterinary Clinic",
//       address: "123 Vet Street",
//       phone: "123-456-7890",
//       email: "info@tapalesvet.com",
//       openingHours: "8 AM - 6 PM",
//       emergencyContact: "987-654-3210"
//     },
//   });
// }

// main()
//   .catch((e) => {
//     console.error(e);
//     process.exit(1);
//   })
//   .finally(async () => {
//     await prisma.$disconnect();
//   });


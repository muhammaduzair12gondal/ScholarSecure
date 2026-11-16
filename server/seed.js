/**
 * Seed script – populates the database with demo users (hashed passwords) and
 * sample applications so the frontend works out of the box.
 *
 * Run once: node seed.js
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import User from './models/User.js';
import Application from './models/Application.js';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB for seeding…');

    // ---- Clear existing data ----
    await User.deleteMany({});
    await Application.deleteMany({});

    // ---- Create users (passwords will be hashed by the pre-save hook) ----
    const student = await User.create({
      name: 'Muhammad Uzair',
      email: 'student@scholarsecure.demo',
      password: 'Student123!',
      role: 'student',
      roleLabel: 'Student',
    });

    const officer = await User.create({
      name: 'Sara Ahmed',
      email: 'officer@scholarsecure.demo',
      password: 'Officer123!',
      role: 'officer',
      roleLabel: 'Scholarship Officer',
    });

    console.log(`✅  Created users: ${student.name} (student), ${officer.name} (officer)`);

    // ---- Create seed applications ----
    const seedApps = [
      {
        appId: 'APP-1001',
        studentId: student._id,
        studentName: 'Muhammad Uzair',
        scholarship: 'HEC Need-Based Scholarship',
        status: 'Under review',
        documentStatus: '4 of 5 verified',
        phone: '0300-000-0001',
        cnic: 'DEMO-CNIC-001',
        internalNote: 'Income evidence requires final cross-check before a decision.',
        studyLevel: 'Undergraduate',
        cgpa: '2.35',
        statement: 'Need-based application submitted for review.',
      },
      {
        appId: 'APP-1002',
        studentId: student._id,
        studentName: 'Areeba Khan',
        scholarship: 'Punjab Educational Endowment Fund',
        status: 'Pending review',
        documentStatus: '5 of 5 verified',
        phone: '0300-000-0002',
        cnic: 'DEMO-CNIC-002',
        internalNote: 'Eligibility evidence is complete. Review academic threshold.',
        studyLevel: 'Undergraduate',
        cgpa: '3.52',
        statement: 'Merit and need application submitted for consideration.',
      },
      {
        appId: 'APP-1003',
        studentId: student._id,
        studentName: 'Hamza Ali',
        scholarship: 'Digital Skills Access Scholarship',
        status: 'Pending review',
        documentStatus: '3 of 4 verified',
        phone: '0300-000-0003',
        cnic: 'DEMO-CNIC-003',
        internalNote: 'Domicile verification is still pending.',
        studyLevel: 'Undergraduate',
        cgpa: '3.11',
        statement: 'Digital skills scholarship application submitted.',
      },
    ];

    await Application.insertMany(seedApps);
    console.log(`✅  Seeded ${seedApps.length} applications`);

    console.log('\n🎉  Database seeded successfully!');
    console.log('   Student login → student@scholarsecure.demo / Student123!');
    console.log('   Officer login → officer@scholarsecure.demo / Officer123!\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('❌  Seed error:', err.message);
    process.exit(1);
  }
}

seed();

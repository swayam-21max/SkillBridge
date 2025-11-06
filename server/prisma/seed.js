// server/prisma/seed.js
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // --- 1. Clear existing data (optional, but good for testing) ---
  // We'll delete in reverse order to avoid constraint errors
  await prisma.enrollment.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.course.deleteMany();
  await prisma.userSkill.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.user.deleteMany();
  console.log('Cleared existing data.');

  // --- 2. Create a mock Trainer ---
  const trainerPassword = await bcrypt.hash('trainer123', 10);
  const trainer = await prisma.user.create({
    data: {
      name: 'Dr. Angela Yu',
      email: 'angela@skillbridge.com',
      password: trainerPassword,
      role: 'trainer',
    },
  });
  console.log(`Created trainer: ${trainer.name}`);

  // --- 3. Create Skills ---
  const webDevSkill = await prisma.skill.create({
    data: {
      name: 'Web Development',
      description: 'Learn to build modern websites and web applications.',
    },
  });

  const dataScienceSkill = await prisma.skill.create({
    data: {
      name: 'Data Science',
      description: 'Analyze data and build machine learning models.',
    },
  });

  const designSkill = await prisma.skill.create({
    data: {
      name: 'UI/UX Design',
      description: 'Design beautiful and user-friendly interfaces.',
    },
  });
  console.log('Created skills: Web Development, Data Science, UI/UX Design');

  // --- 4. Create Courses ---
  const courses = [
    {
      title: 'The Complete 2025 Web Development Bootcamp',
      description: 'Become a Full-Stack Web Developer with just one course. HTML, CSS, Javascript, Node, React, MongoDB and more!',
      price: 899,
      trainerId: trainer.id,
      skillId: webDevSkill.id,
      image: 'https://images.unsplash.com/photo-1579403124614-197f69d8187b?q=80&w=1740&auto=format&fit=crop',
    },
    {
      title: 'Advanced Node.js and Express',
      description: 'Master Node.js, build enterprise-level APIs, and deploy scalable applications.',
      price: 799,
      trainerId: trainer.id,
      skillId: webDevSkill.id,
      image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1740&auto=format&fit=crop',
    },
    {
      title: 'Data Science with Python',
      description: 'Complete Data Science training: Mathematics, Statistics, Python, and advanced Machine & Deep Learning.',
      price: 999,
      trainerId: trainer.id,
      skillId: dataScienceSkill.id,
      image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=1740&auto=format&fit=crop',
    },
    {
      title: 'UI/UX Design Fundamentals',
      description: 'Learn the fundamentals of UI/UX design, from user research to creating high-fidelity prototypes.',
      price: 399,
      trainerId: trainer.id,
      skillId: designSkill.id,
      image: 'https://images.unsplash.com/photo-1587440871875-191322ee64b0?q=80&w=1742&auto=format&fit=crop',
    },
    {
      title: 'Modern React with Hooks & Redux',
      description: 'Dive deep into React.js, learn Hooks, Redux, React Router, and build powerful applications.',
      price: 599,
      trainerId: trainer.id,
      skillId: webDevSkill.id,
      image: 'https://images.unsplash.com/photo-1633356122102-38601e0b04c0?q=80&w=1740&auto=format&fit=crop',
    },
    {
      title: 'Complete Python Pro Bootcamp',
      description: 'Go from zero to hero in Python 3. Learn to build 100 Python projects and become a certified developer.',
      price: 499,
      trainerId: trainer.id,
      skillId: dataScienceSkill.id,
      image: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1740&auto=format&fit=crop',
    },
    {
      title: 'Figma for UI/UX Design (Advanced)',
      description: 'Master Figma for advanced UI/UX design, including design systems, components, and collaboration.',
      price: 699,
      trainerId: trainer.id,
      skillId: designSkill.id,
      image: 'https://images.unsplash.com/photo-1605371333333-049d58a89b0d?q=80&w=1740&auto=format&fit=crop',
    },
    {
      title: 'Docker and Kubernetes: The Complete Guide',
      description: 'Build, test, and deploy applications with Docker and Kubernetes on a complete hands-on course.',
      price: 799,
      trainerId: trainer.id,
      skillId: webDevSkill.id,
      image: 'https://images.unsplash.com/photo-1605742294431-a8377c86503e?q=80&w=1740&auto=format&fit=crop',
    },
  ];

  for (const course of courses) {
    await prisma.course.create({
      data: course,
    });
  }
  console.log(`Created ${courses.length} courses`);
  console.log('Seeding finished.');
}

main()
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
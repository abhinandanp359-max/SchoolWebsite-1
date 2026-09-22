const Admin = require('../models/Admin');
const Gallery = require('../models/Gallery');

const realGalleryImages = [
  // Campus
  { title: "Main School Campus", category: "campus", image: "/images/campus/campus01.webp" },
  { title: "School Building View", category: "campus", image: "/images/campus/campus02.webp" },
  { title: "Campus Courtyard", category: "campus", image: "/images/campus/campus03.webp" },

  // Assembly
  { title: "Morning Assembly", category: "assembly", image: "/images/assembly/assembly.webp" },
  { title: "Student Line Assembly", category: "assembly", image: "/images/assembly/assembly01.webp" },

  // Students
  { title: "Classroom Students", category: "students", image: "/images/students/students01.webp" },
  { title: "Student Learning Session", category: "students", image: "/images/students/students02.webp" },

  // Events
  { title: "Cultural Dance Event", category: "events", image: "/images/events/dance01.webp" },
  { title: "School Event Celebration", category: "events", image: "/images/events/events01.webp" },
  { title: "Stage Performance", category: "events", image: "/images/events/events02.webp" },
  { title: "Annual Day Event", category: "events", image: "/images/events/events03.webp" },
  { title: "Student Choir & Music", category: "events", image: "/images/events/events04.webp" },
  { title: "Award Distribution Event", category: "events", image: "/images/events/events05.webp" },
  { title: "Grand Celebration Event", category: "events", image: "/images/events/events06.webp" },
  { title: "Outdoor School Event", category: "events", image: "/images/events/events07.webp" },
  { title: "Cultural Festival", category: "events", image: "/images/events/events08.webp" },

  // Yoga
  { title: "Yoga Day Session", category: "yoga", image: "/images/yoga/yoga.webp" },
  { title: "Student Yoga Practice 1", category: "yoga", image: "/images/yoga/yoga01.webp" },
  { title: "Student Yoga Practice 2", category: "yoga", image: "/images/yoga/yoga02.webp" },
  { title: "Student Yoga Practice 3", category: "yoga", image: "/images/yoga/yoga03.webp" },
  { title: "Student Yoga Practice 4", category: "yoga", image: "/images/yoga/yoga04.webp" },
  { title: "Group Yoga Asana", category: "yoga", image: "/images/yoga/yoga05.webp" },
  { title: "Outdoor Yoga Session", category: "yoga", image: "/images/yoga/yoga06.webp" },
  { title: "Yoga Meditation", category: "yoga", image: "/images/yoga/yoga07.webp" },
  { title: "Yoga Demonstration", category: "yoga", image: "/images/yoga/yoga08.webp" },
  { title: "Mass Yoga Event", category: "yoga", image: "/images/events/yoga day.webp" },

  // Independence Day / Celebrations
  { title: "Independence Day Flag Hoisting", category: "celebrations", image: "/images/independence/inde01.webp" },
  { title: "Independence Day Parade", category: "celebrations", image: "/images/independence/inde02.webp" },
  { title: "Patriotic Performance", category: "celebrations", image: "/images/independence/inde03.webp" },
  { title: "National Celebration", category: "celebrations", image: "/images/independence/inde04.webp" },
  { title: "Flag Ceremony", category: "celebrations", image: "/images/independence/inde05.webp" },
  { title: "Independence Day Gathering", category: "celebrations", image: "/images/independence/inde06.webp" }
];

const seedAdmin = async () => {
  try {
    const existingAdmin = await Admin.findOne({ username: 'admin' });
    if (!existingAdmin) {
      await Admin.create({
        username: 'admin',
        password: 'MountCarmel@2024',
      });
      console.log('Default admin user created successfully.');
    }

    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.insertMany(realGalleryImages);
      console.log('Real gallery images seeded successfully.');
    }
  } catch (error) {
    console.error('Error in seed process:', error.message);
  }
};

module.exports = seedAdmin;

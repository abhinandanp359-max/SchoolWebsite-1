const Admin = require('../models/Admin');
const Gallery = require('../models/Gallery');

const initialGalleryData = [
  { title: "Main Campus Building", category: "campus", image: "/images/branding/hero.png" },
  { title: "School Entrance & Gardens", category: "campus", image: "/images/hero/hero-assembly-bright.jpg" },
  { title: "Science Laboratory", category: "campus", image: "/images/branding/hero.png" },
  { title: "School Library & Reading Hall", category: "campus", image: "/images/hero/hero-assembly-bright.jpg" },
  { title: "Modern Computer Lab", category: "campus", image: "/images/branding/hero.png" },
  { title: "Green Playground & Sports Complex", category: "campus", image: "/images/hero/hero-assembly-bright.jpg" },

  { title: "Morning Prayer & Assembly", category: "assembly", image: "/images/hero/hero-assembly-bright.jpg" },
  { title: "Principal Addressing Students", category: "assembly", image: "/images/branding/hero.png" },
  { title: "National Anthem & Pledge", category: "assembly", image: "/images/hero/hero-assembly-bright.jpg" },

  { title: "Classroom Learning Sessions", category: "students", image: "/images/branding/hero.png" },
  { title: "Group Discussion & Activity", category: "students", image: "/images/hero/hero-assembly-bright.jpg" },
  { title: "Interactive Smart Board Learning", category: "students", image: "/images/branding/hero.png" },
  { title: "Art & Craft Workshop", category: "students", image: "/images/hero/hero-assembly-bright.jpg" },

  { title: "Annual Sports Day Competition", category: "sports", image: "/images/branding/hero.png" },
  { title: "Inter-House Football Championship", category: "sports", image: "/images/hero/hero-assembly-bright.jpg" },
  { title: "Basketball Finals", category: "sports", image: "/images/branding/hero.png" },

  { title: "International Yoga Day Celebration", category: "yoga", image: "/images/hero/hero-assembly-bright.jpg" },
  { title: "Morning Meditation Session", category: "yoga", image: "/images/branding/hero.png" },

  { title: "Annual Cultural Fest Performance", category: "cultural", image: "/images/hero/hero-assembly-bright.jpg" },
  { title: "Traditional Folk Dance", category: "cultural", image: "/images/branding/hero.png" },
  { title: "School Choir & Music Performance", category: "cultural", image: "/images/hero/hero-assembly-bright.jpg" },

  { title: "Independence Day Flag Hoisting", category: "celebrations", image: "/images/branding/hero.png" },
  { title: "Teachers' Day Celebration", category: "celebrations", image: "/images/hero/hero-assembly-bright.jpg" },
  { title: "Christmas & New Year Festivities", category: "celebrations", image: "/images/branding/hero.png" },

  { title: "Robotics Club Demonstration", category: "activities", image: "/images/hero/hero-assembly-bright.jpg" },
  { title: "Tree Plantation Drive", category: "activities", image: "/images/branding/hero.png" },
  { title: "Cleanliness & Social Service Drive", category: "activities", image: "/images/hero/hero-assembly-bright.jpg" },
  { title: "Inter-School Debate Championship", category: "events", image: "/images/branding/hero.png" },
  { title: "Science Exhibition Models Display", category: "events", image: "/images/hero/hero-assembly-bright.jpg" },
  { title: "Excellence Awards Ceremony", category: "events", image: "/images/branding/hero.png" }
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
      await Gallery.insertMany(initialGalleryData);
      console.log('Default gallery images seeded successfully.');
    }
  } catch (error) {
    console.error('Error in seed process:', error.message);
  }
};

module.exports = seedAdmin;

const mongoose = require('mongoose');
const Service = require('./models/Service');
const Exercise = require('./models/Exercise');
require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const physiotherapyServices = [
    {
        id: 'neck-pain',
        title: 'Neck Pain',
        titleHi: 'गर्दन का दर्द',
        icon: 'fa-user-doctor',
        image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=2020&auto=format&fit=crop',
        tagline: 'Cervical Spondylosis & Stiffness',
        desc: 'Relieve chronic neck stiffness and cervical distribution with targeted manual therapy.',
        content: [
            "Neck pain can significantly impact your daily quality of life, often manifesting as stiffness, sharp pain, or radiation into the shoulders and arms. Our specialized physiotherapy approach focuses on diagnosing the root cause—whether it's cervical spondylosis, poor posture, or muscle strain.",
            "We employ a combination of manual mobilization, posture correction techniques, and ergonomic advice. Our advanced machines like IFT and Ultrasound help reduce inflammation and speed up the recovery process.",
            "Long-term relief is achieved through personalized exercise protocols designed to strengthen the supporting neck muscles and improve flexibility, preventing future recurrences."
        ]
    },
    {
        id: 'back-pain',
        title: 'Back Pain',
        titleHi: 'पीठ/कमर का दर्द',
        icon: 'fa-person-falling-burst',
        image: 'https://images.unsplash.com/photo-1590233541916-7003b5263a20?q=80&w=2070&auto=format&fit=crop',
        tagline: 'Lumbar Support & Recovery',
        desc: 'Comprehensive treatments for lower back pain, muscle spasms, and spinal health.',
        content: [
            "Lower back pain is one of the most common ailments we treat. It can range from a dull ache to disabling sharp sensations. Our goal is to restore your mobility and get you back to your active lifestyle as quickly as possible.",
            "Our treatment involves spinal decompression techniques, core stabilization exercises, and therapeutic massage to release tight lumbar muscles. We also utilize heat therapy and electrical stimulation to manage acute pain cycles.",
            "We provide a complete rehabilitation program that includes education on lifting techniques, sitting posture, and a home-based strengthening regimen to ensure your spine remains healthy and resilient."
        ]
    },
    {
        id: 'knee-pain',
        title: 'Knee Pain',
        titleHi: 'घुटने का दर्द',
        icon: 'fa-wheelchair',
        image: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2001&auto=format&fit=crop',
        tagline: 'Osteoarthritis & ACL Recovery',
        desc: 'Specialized care for knee joints, ligament injuries, and post-surgery rehab.',
        content: [
            "Whether it's the result of aging (Osteoarthritis) or a sports-related ligament injury, knee pain can severely limit your walking and climbing abilities. We specialize in both conservative management and post-surgical rehabilitation.",
            "Our protocols include quadriceps strengthening, joint mobilization, and gait training. For arthritic patients, we focus on improving joint lubrication and reducing weight-bearing stress through corrective exercises.",
            "Advanced modalities such as Laser therapy and TENS are used to manage swelling and pain, ensuring you gain the maximum range of motion in the shortest possible time."
        ]
    },
    {
        id: 'shoulder-pain',
        title: 'Shoulder Pain',
        titleHi: 'कंधे का दर्द',
        icon: 'fa-child-reaching',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
        tagline: 'Rotator Cuff & Impingement',
        desc: 'Reclaim your reaching and lifting range with expert shoulder mobilization.',
        content: [
            "Shoulder issues often stem from rotator cuff tears, bursitis, or impingement syndrome. These conditions make even simple tasks like reaching for a shelf or dressing up painful and difficult.",
            "We use precise manual therapy techniques to improve the mechanics of the shoulder joint. Strengthening the small stabilizing muscles of the rotator cuff is a key part of our recovery program.",
            "Our therapists provide specific stretching and strengthening exercises that gradually increase your load-bearing capacity without aggravating the injury."
        ]
    },
    {
        id: 'frozen-shoulder',
        title: 'Frozen Shoulder',
        titleHi: 'कंधा जाम होना',
        icon: 'fa-ice-cream',
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
        tagline: 'Adhesive Capsulitis Therapy',
        desc: 'Break the cycle of stiffness and restore full rotation with intensive rehab.',
        content: [
            "Frozen shoulder (Adhesive Capsulitis) is characterized by progressive stiffness and intense pain. It can last for months if not treated aggressively through physiotherapy.",
            "Our specialized 'Frozen Shoulder Protocol' includes joint distension techniques and aggressive mobilization under pain management. We focus on stretching the tight joint capsule to restore the normal 'roll and glide' of the humerus.",
            "Consistency is key in treating this condition. We work closely with patients over multiple weeks to ensure they regain their full functional reach and night-time comfort."
        ]
    },
    {
        id: 'slip-disc',
        title: 'Slip/Herniated Disc',
        titleHi: 'स्लिप डिस्क',
        icon: 'fa-bone',
        image: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?q=80&w=2070&auto=format&fit=crop',
        tagline: 'Spinal Decompression',
        desc: 'Non-surgical management of disc bulges and nerve compression symptoms.',
        content: [
            "A herniated or 'slipped' disc can press against spinal nerves, causing severe localized pain or radiation. Most cases can be managed effectively without surgery through structured physiotherapy.",
            "We use McKenzie method exercises and mechanical traction to encourage the disc material to move away from the nerve. Core stability training is essential to provide 'internal bracing' for the affected spinal segment.",
            "Our approach also includes pain education and activity modification strategies to prevent further disc protrusion and promote long-term spinal health."
        ]
    },
    {
        id: 'sciatica',
        title: 'Sciatica',
        titleHi: 'सायटिका',
        icon: 'fa-bolt',
        image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2052&auto=format&fit=crop',
        tagline: 'Nerve Pain Relief',
        desc: 'Relieve the burning sensation and numbness traveling down your leg.',
        content: [
            "Sciatica is pain that radiates along the path of the sciatic nerve, from your lower back through your hips and down each leg. It is often caused by a disc bulge or piriformis syndrome.",
            "Our treatment focuses on nerve flossing techniques and stretching the muscles that may be compressing the nerve. We use specialized modalities to reduce nerve inflammation and improve circulation.",
            "By strengthening the lower back and improving hip mobility, we help alleviate the pressure on the sciatic nerve and prevent the recurrence of debilitating shooting pains."
        ]
    },
    {
        id: 'ankle-pain',
        title: 'Ankle Pain',
        titleHi: 'टखने का दर्द',
        icon: 'fa-shoe-prints',
        image: 'https://images.unsplash.com/photo-1598136490941-30d885318abd?q=80&w=2069&auto=format&fit=crop',
        tagline: 'Sprain & Strain Recovery',
        desc: 'Restore balance and stability after ankle injuries or ligament tears.',
        content: [
            "Ankle sprains are common injuries that, if not rehabilitated properly, can lead to chronic instability and repeated injuries. We provide comprehensive care for both acute and chronic ankle issues.",
            "Rehab involves proprioception (balance) training, strength exercises for the lower leg, and mobilization of the small bones in the foot. We ensure the ligaments heal correctly and gain back their original strength.",
            "We also provide advice on footwear and taping techniques for athletes to ensure they can return to their sport with confidence and reduced risk of re-injury."
        ]
    },
    {
        id: 'rheumatoid-arthritis',
        title: 'Rheumatoid Arthritis',
        titleHi: 'गठिया बाय',
        icon: 'fa-hand-dots',
        image: 'https://images.unsplash.com/photo-1579126038827-77aa47395015?q=80&w=2041&auto=format&fit=crop',
        tagline: 'Chronic Joint Management',
        desc: 'Maintain joint mobility and reduce stiffness for patients with inflammatory arthritis.',
        content: [
            "RA is an autoimmune condition that causes painful inflammation in the joints. Physiotherapy plays a crucial role in maintaining function and preventing joint deformities over time.",
            "Our goal is to manage flare-ups using gentle joint mobilizations, cryotherapy, and custom exercise programs that don't overstress the inflamed joints. We focus on preserving range of motion and muscle strength.",
            "We provide education on joint protection techniques and ergonomic adaptations to make daily tasks easier and less painful for our RA patients."
        ]
    },
    {
        id: 'sports-rehab',
        title: 'Sports Rehab',
        titleHi: 'खेल उपचार',
        icon: 'fa-person-running',
        image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070&auto=format&fit=crop',
        tagline: 'Athlete Performance Recovery',
        desc: 'Get back to your peak performance with sport-specific injury rehabilitation.',
        content: [
            "Sports injuries require a different level of rehabilitation aimed at high-demand physical activity. Whether it's a muscle tear, ligament strain, or stress fracture, we tailor the rehab to your specific sport.",
            "Functional training, agility drills, and sport-specific movements are integrated into the later stages of recovery. We focus on correcting movement patterns that may have contributed to the injury in the first place.",
            "Our team works to optimize your biomechanics, ensuring you return to play stronger and with a reduced likelihood of future injuries."
        ]
    },
    {
        id: 'tennis-elbow',
        title: 'Tennis Elbow',
        titleHi: 'टेनिस एल्बो',
        icon: 'fa-table-tennis-paddle-ball',
        image: 'https://images.unsplash.com/photo-1617083281297-af33e63ae892?q=80&w=2070&auto=format&fit=crop',
        tagline: 'Lateral Epicondylitis Relief',
        desc: 'Fix localized elbow pain caused by repetitive strain or over-activity.',
        content: [
            "Tennis elbow is a painful condition caused by overloading the tendons in your elbow, usually due to repetitive motions of the wrist and arm. It doesn't just affect tennis players—it's common among office workers and manual laborers too.",
            "Treatment includes eccentric loading exercises for the forearm, deep tissue massage, and ultrasound therapy to promote tendon healing. We also check for neck or shoulder issues that might be contributing to the elbow strain.",
            "We provide advice on activity modification and the use of braces during the recovery phase to protect the tendon and allow for functional use of the arm."
        ]
    },
    {
        id: 'vertigo',
        title: 'Vertigo',
        titleHi: 'चक्कर आना',
        icon: 'fa-rotate',
        image: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?q=80&w=2070&auto=format&fit=crop',
        tagline: 'Vestibular Rehabilitation',
        desc: 'Specialized maneuvers to treat dizziness and balance disorders (BPPV).',
        content: [
            "Vertigo or dizziness can often be treated effectively through Vestibular Rehabilitation Therapy (VRT). A common cause is BPPV—where tiny crystals in the inner ear get displaced.",
            "We use specialized maneuvers like the Epley maneuver to reposition these crystals and provide immediate relief. We also design exercises to help your brain compensate for vestibular imbalances.",
            "Balance training and habituation exercises are provided to reduce the frequency and intensity of dizzy spells, helping you regain your confidence in moving safely."
        ]
    },
    {
        id: 'osteoporosis',
        title: 'Osteoporosis',
        titleHi: 'हड्डियों की कमजोरी',
        icon: 'fa-bone',
        image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop',
        tagline: 'Bone Density Support',
        desc: 'Scientific weight-bearing exercises and fall prevention for weak bones.',
        content: [
            "Osteoporosis makes bones weak and brittle—so brittle that a fall or even mild stresses like bending over or coughing can cause a fracture. Exercise is a critical component of bone health.",
            "We design safe, weight-bearing, and resistance exercise programs that help stimulate bone growth and slow down bone loss. Balance and coordination training are emphasized to prevent falls, which are the leading cause of fractures.",
            "Our therapists provide education on safe movement patterns during daily activities to protect the spine and hips from unnecessary stress and potential injury."
        ]
    }
];

const exercisesData = [
    { 
        id: 'neck-stretch',
        title: 'Neck Stretch', 
        hindi: '(गर्दन का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?q=80&w=2070&auto=format&fit=crop',
        icon: 'fa-user-nurse',
        fullDetails: 'Perform this stretch slowly to relieve tension in the cervical spine. Sit straight, gently tilt your right ear toward your right shoulder using your hand for light pressure. Hold for 30 seconds. Switch sides. This effectively combats "text neck" and poor posture-induced stiffness.'
    },
    { 
        id: 'shoulder-rotation',
        title: 'Shoulder Rotation', 
        hindi: '(कंधे का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=2070&auto=format&fit=crop',
        icon: 'fa-dumbbell',
        fullDetails: 'Essential for maintaining rotator cuff health and scapular mobility. Keep your arms relaxed at your sides. Slowly roll your shoulders up, back, down, and forward in smooth, large circles. Perform 10 backward rotations, then 10 forward rotations to lubricate the shoulder joint.'
    },
    { 
        id: 'back-stretch',
        title: 'Back Stretch', 
        hindi: '(पीठ का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1600881333168-2ef49b341f30?q=80&w=2070&auto=format&fit=crop',
        icon: 'fa-child-reaching',
        fullDetails: 'The Child’s Pose (Balasana) is highly recommended for lower back decompression. Kneel on the floor, toes together, knees apart. Sit on your heels and walk your hands forward until your forehead touches the floor. Breathe deeply into your lower back and hold for 1 minute.'
    },
    { 
        id: 'knee-bending',
        title: 'Knee Bending', 
        hindi: '(घुटने का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1552196563-55cd4e45efb3?q=80&w=2052&auto=format&fit=crop',
        icon: 'fa-bed',
        fullDetails: 'Critical for post-op knee recovery or arthritis management (Heel Slides). Lie flat on your back or sit straight. Slowly slide your heel toward your glutes, bending your knee as far as comfortably possible. Hold for 5 seconds, then slowly straighten. Repeat 15 times per leg.'
    },
    { 
        id: 'ankle-rotation',
        title: 'Ankle Rotation', 
        hindi: '(टखने का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1598136490941-30d885318abd?q=80&w=2069&auto=format&fit=crop',
        icon: 'fa-shoe-prints',
        fullDetails: 'Improves proprioception and joint mobility. Lift your foot slightly off the floor. Draw a large, slow circle in the air with your big toe. Make 10 clockwise circles, followed by 10 counter-clockwise circles. This is excellent for recovering from sprains or prolonged immobilization.'
    },
    { 
        id: 'leg-raise',
        title: 'Leg Raise', 
        hindi: '(पैर उठाने का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1599901860904-17e6ed7083a0?q=80&w=2069&auto=format&fit=crop',
        icon: 'fa-arrows-up-to-line',
        fullDetails: 'The Straight Leg Raise (SLR) is a fundamental isometric exercise for strengthening the quadriceps without stressing the knee joint. Lie on your back, keep one knee bent and the other straight. Tighten the thigh muscle of the straight leg and lift it about 12 inches. Hold for 5 seconds, lower slowly. Do 15 reps.'
    },
    { 
        id: 'bridging',
        title: 'Bridging', 
        hindi: '(कमर उठाने का व्यायाम)', 
        image: 'https://images.unsplash.com/photo-1544367563-12123d8d5e58?q=80&w=2070&auto=format&fit=crop',
        icon: 'fa-mattress',
        fullDetails: 'Core and glute activation work designed to stabilize the lumbar spine. Lie on your back with arms at your sides, knees bent, and feet flat on the floor. Squeeze your glute roots and lift your hips until your body forms a straight line from your shoulders to knees. Hold for 5 seconds, lower with control. Perform 12 reps.'
    },
    { 
        id: 'squat',
        title: 'Squat', 
        hindi: '(उठक-बैठक)', 
        image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?q=80&w=2069&auto=format&fit=crop',
        icon: 'fa-person-arrow-down-to-line',
        fullDetails: 'Functional lower-body strengthening. From a standing position (feet shoulder-width apart), initiate the movement by pushing your hips back as if sitting in a chair. Keep your chest up and knees behind your toes. Descend to a manageable depth, then drive through your heels to stand up. Repeat 10-15 times.'
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Connected to MongoDB for seeding...");

        // Clear existing
        await Service.deleteMany({});
        await Exercise.deleteMany({});
        console.log("Cleared existing services and exercises.");

        // Insert
        await Service.insertMany(physiotherapyServices);
        await Exercise.insertMany(exercisesData);

        console.log("Successfully seeded services and exercises! ✅");
        process.exit();
    } catch (err) {
        console.error("Seeding error:", err);
        process.exit(1);
    }
};

seedDB();

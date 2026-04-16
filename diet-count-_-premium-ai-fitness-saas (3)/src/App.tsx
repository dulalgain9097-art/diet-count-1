import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'motion/react';
import { 
  Activity, 
  Download, 
  Flame, 
  Dumbbell, 
  Leaf, 
  ArrowRight, 
  Menu, 
  X, 
  Loader2,
  ShieldCheck,
  CheckCircle,
  Star,
  Zap,
  Target,
  Users,
  Clock,
  ChevronRight,
  MessageCircle,
  TrendingUp,
  Award,
  Apple,
  Beef,
  Heart,
  Timer,
  Carrot,
  Grape,
  Utensils,
  Scale,
  Brain
} from 'lucide-react';
import { jsPDF } from 'jspdf';

// --- Types ---
interface FormData {
  name: string;
  email: string;
  phone: string;
  age: string;
  gender: string;
  height: string; // Now in Feet
  weight: string;
  goal: string;
  diet: string;
  filters: string[];
  otherAllergy: string;
  workoutDays: string;
}

interface PlanResult {
  plan: string;
}

// --- Constants ---
const GOALS = [
  { id: 'fat_loss', label: 'Fat Loss', icon: <Flame className="w-5 h-5" /> },
  { id: 'muscle_gain', label: 'Muscle Gain', icon: <Dumbbell className="w-5 h-5" /> },
  { id: 'muscle_fat', label: 'Muscle Gain + Fat Loss', icon: <Activity className="w-5 h-5" /> },
  { id: 'general_health', label: 'General Health', icon: <Leaf className="w-5 h-5" /> },
];

const DIET_TYPES = [
  { id: 'veg', label: 'Vegetarian', icon: <Leaf className="w-5 h-5" /> },
  { id: 'nonveg', label: 'Non-Vegetarian', icon: <Activity className="w-5 h-5" /> },
  { id: 'both', label: 'Both (Veg + Non-Veg)', icon: <Activity className="w-5 h-5" /> },
];

const TESTIMONIALS = [
  { name: "Rahul Sharma", goal: "Fat Loss", result: "Lost 12kg in 3 months", text: "The Indian meal plans are so practical. I never felt like I was on a diet.", image: "https://picsum.photos/seed/rahul/200/200", rating: 5 },
  { name: "Priya Patel", goal: "Muscle Gain", result: "Gained 5kg lean muscle", text: "Finally a plan that understands Indian vegetarian protein sources!", image: "https://picsum.photos/seed/priya/200/200", rating: 5 },
  { name: "Amit Verma", goal: "General Health", result: "Improved energy levels", text: "The mid-meal snacks are a game changer for my busy office schedule.", image: "https://picsum.photos/seed/amit/200/200", rating: 5 },
  { name: "Sneha Reddy", goal: "Fat Loss", result: "Lost 8kg & 4 inches", text: "Simple, effective, and tailored to my food allergies. Highly recommend!", image: "https://picsum.photos/seed/sneha/200/200", rating: 4 },
  { name: "Vikram Singh", goal: "Muscle Gain", result: "Extreme transformation", text: "The workout plan combined with the diet gave me the best results ever.", image: "https://picsum.photos/seed/vikram/200/200", rating: 5 },
  { name: "Anjali Gupta", goal: "Muscle + Fat Loss", result: "Toned body in 4 months", text: "I love how the AI adjusts everything based on my height and weight.", image: "https://picsum.photos/seed/anjali/200/200", rating: 5 },
];

const Logo = ({ className = "w-10 h-10" }: { className?: string }) => (
  <motion.div 
    className={`relative flex items-center justify-center ${className}`}
    animate={{ y: [0, -3, 0] }}
    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  >
    <div className="absolute inset-0 bg-green-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    <svg viewBox="0 0 100 100" className="relative w-full h-full drop-shadow-[0_0_5px_rgba(76,175,80,0.3)]">
      {/* Human Figure */}
      <circle cx="50" cy="40" r="5" fill="#2D6A4F" />
      <path 
        d="M50 50 L40 35 M50 50 L60 35 M50 50 L40 75 M50 50 L60 75" 
        stroke="#2D6A4F" strokeWidth="8" strokeLinecap="round" 
      />
      <path 
        d="M50 45 L50 55" 
        stroke="#2D6A4F" strokeWidth="10" strokeLinecap="round" 
      />
      
      {/* Leaves - Arranged in arcs */}
      {/* Row 1 (Top) */}
      <path d="M50 2 C50 2 46 9 50 15 C54 9 50 2 50 2 Z" fill="#74C69D" />
      
      {/* Row 2 */}
      <path d="M38 7 C38 7 35 15 40 19 C44 15 38 7 38 7 Z" fill="#52B788" />
      <path d="M62 7 C62 7 65 15 60 19 C56 15 62 7 62 7 Z" fill="#52B788" />
      <path d="M50 17 C50 17 47 23 50 28 C53 23 50 17 50 17 Z" fill="#409167" />
      
      {/* Row 3 */}
      <path d="M28 15 C28 15 24 23 30 27 C34 23 28 15 28 15 Z" fill="#409167" />
      <path d="M72 15 C72 15 76 23 70 27 C66 23 72 15 72 15 Z" fill="#409167" />
      <path d="M38 25 C38 25 35 33 40 37 C44 33 38 25 38 25 Z" fill="#2D6A4F" />
      <path d="M62 25 C62 25 65 33 60 37 C56 33 62 25 62 25 Z" fill="#2D6A4F" />
      
      {/* Side Leaves */}
      <path d="M20 30 C20 30 18 38 24 40 C28 36 20 30 20 30 Z" fill="#52B788" />
      <path d="M80 30 C80 30 82 38 76 40 C72 36 80 30 80 30 Z" fill="#52B788" />
      <path d="M30 40 C30 40 28 48 34 50 C38 46 30 40 30 40 Z" fill="#409167" />
      <path d="M70 40 C70 40 72 48 66 50 C62 46 70 40 70 40 Z" fill="#409167" />
    </svg>
  </motion.div>
);

const FILTERS = [
  { id: 'gluten_free', label: 'Gluten Free' },
  { id: 'lactose_free', label: 'Lactose Free' },
  { id: 'sugar_free', label: 'Sugar Free' },
];

const WORKOUT_OPTIONS = [
  { id: 'none', label: 'No Workout Plan' },
  { id: '1', label: '1 Day Plan' },
  { id: '2', label: '2 Day Plan' },
  { id: '3', label: '3 Day Plan' },
  { id: '4', label: '4 Day Plan' },
  { id: '5', label: '5 Day Plan' },
  { id: '6', label: '6 Day Plan' },
];

const LOADING_STEPS = [
  "Analyzing your body data...",
  "Calculating calorie needs...",
  "Designing your diet plan...",
  "Preparing your PDF...",
];

const PAYMENT_LOADING_STEPS = [
  "Processing your payment...",
  "Verifying transaction...",
  "Generating your AI diet plan...",
  "Creating your PDF...",
];

// --- Helper Components for Advanced UI ---

const TiltCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

const Sticker = ({ children, className = "", delay = 0 }: { children: React.ReactNode, className?: string, delay?: number }) => (
  <motion.div
    initial={{ scale: 0, rotate: -20 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 260, damping: 20, delay }}
    whileHover={{ scale: 1.1, rotate: 5 }}
    className={`bg-white p-2 rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center ${className}`}
  >
    {children}
  </motion.div>
);

const FloatingDecorations = () => {
  const icons = [
    { Icon: Apple, color: "text-red-500/20", top: "15%", left: "10%", size: 40 },
    { Icon: Dumbbell, color: "text-gray-500/20", top: "25%", left: "85%", size: 50 },
    { Icon: Carrot, color: "text-orange-500/20", top: "65%", left: "5%", size: 45 },
    { Icon: Beef, color: "text-red-800/20", top: "85%", left: "15%", size: 55 },
    { Icon: Heart, color: "text-pink-500/20", top: "45%", left: "90%", size: 35 },
    { Icon: Timer, color: "text-blue-500/20", top: "75%", left: "80%", size: 40 },
    { Icon: Grape, color: "text-purple-500/20", top: "10%", left: "75%", size: 42 },
    { Icon: Utensils, color: "text-yellow-500/20", top: "55%", left: "12%", size: 38 },
    { Icon: Scale, color: "text-green-500/20", top: "35%", left: "20%", size: 48 },
    { Icon: Brain, color: "text-indigo-500/20", top: "90%", left: "70%", size: 44 },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {icons.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: 1,
            y: [0, -20, 0],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 5 + Math.random() * 5, 
            repeat: Infinity, 
            delay: i * 0.5 
          }}
          style={{ top: item.top, left: item.left }}
          className={`absolute ${item.color}`}
        >
          <item.Icon size={item.size} strokeWidth={1.5} />
        </motion.div>
      ))}
    </div>
  );
};

const LiveActivity = () => {
  const [activity, setActivity] = useState({ name: "Rahul S.", action: "just generated a Weight Loss plan", time: "2m ago" });
  
  useEffect(() => {
    const activities = [
      { name: "Priya K.", action: "just generated a Muscle Gain plan", time: "1m ago" },
      { name: "Ankit M.", action: "just started their transformation", time: "4m ago" },
      { name: "Sneha R.", action: "downloaded their custom diet PDF", time: "30s ago" },
      { name: "Vikram J.", action: "joined the 10k+ community", time: "5m ago" },
    ];
    
    const interval = setInterval(() => {
      setActivity(activities[Math.floor(Math.random() * activities.length)]);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return null;
};

const InteractiveBackground = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="mesh-bg absolute inset-0 opacity-40" />
      <FloatingDecorations />
      <motion.div 
        animate={{ 
          x: [0, 100, 0], 
          y: [0, 50, 0],
          scale: [1, 1.2, 1]
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-green-500/10 blur-[120px] rounded-full"
      />
      <motion.div 
        animate={{ 
          x: [0, -100, 0], 
          y: [0, -50, 0],
          scale: [1, 1.3, 1]
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-accent/5 blur-[150px] rounded-full"
      />
    </div>
  );
};

export default function App() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    diet: '',
    filters: [],
    otherAllergy: '',
    workoutDays: 'none',
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<string | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [isPaid, setIsPaid] = useState(true);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [view, setView] = useState<'home' | 'privacy' | 'terms' | 'refund' | 'shipping' | 'contact' | 'about'>('home');

  // Scroll reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [view]);

  // Loading animation logic
  useEffect(() => {
    if (isGenerating) {
      const interval = setInterval(() => {
        setLoadingStep((prev) => (prev < PAYMENT_LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 2500);
      return () => clearInterval(interval);
    } else {
      setLoadingStep(0);
    }
  }, [isGenerating]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleFilterChange = (filterId: string) => {
    setFormData((prev) => ({
      ...prev,
      filters: prev.filters.includes(filterId)
        ? prev.filters.filter((f) => f !== filterId)
        : [...prev.filters, filterId],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // New Flow: Show payment modal first
    setShowPaymentModal(true);
  };

  const startGeneration = async () => {
    setIsGenerating(true);
    setShowPaymentModal(false);

    try {
      const response = await fetch('/api/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          filters: formData.filters.join(', '),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate plan');
      }

      setResult(data.plan);
      setShowResult(true);
      setShowSuccessPopup(true);
    } catch (error: any) {
      console.error(error);
      const message = error.message || 'Something went wrong. Please try again.';
      alert(`Error: ${message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const generatePDF = () => {
    if (!result) {
      alert("No plan generated yet. Please generate a plan first.");
      return;
    }

    if (!isPaid) {
      alert("Please unlock the full plan to download the PDF.");
      handlePayment();
      return;
    }

    try {
      // Robust initialization for different environments
      let PDFLib: any;
      
      if (typeof jsPDF === 'function') {
        PDFLib = jsPDF;
      } else if (jsPDF && (jsPDF as any).jsPDF) {
        PDFLib = (jsPDF as any).jsPDF;
      } else if ((window as any).jspdf && (window as any).jspdf.jsPDF) {
        PDFLib = (window as any).jspdf.jsPDF;
      }

      if (!PDFLib) {
        console.error("jsPDF library not found in any expected location");
        alert("PDF library failed to load. Please check your internet connection and refresh.");
        return;
      }

      const doc = new PDFLib();
      
      if (!doc || !doc.internal || !doc.internal.pageSize) {
        throw new Error("Failed to initialize PDF document instance");
      }

      const pageWidth = doc.internal.pageSize.getWidth();
      const margin = 20;
      const contentWidth = pageWidth - margin * 2;

      // --- Header ---
      // Branded Green Header
      doc.setFillColor(76, 175, 80);
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      doc.setFontSize(28);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.text('DIET COUNT PLAN', margin, 25);
      
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.text('Smart Eating, Real-Time Advice, Real Food. Real Talk', margin, 32);

      // --- Client Info Section ---
      let y = 55;
      doc.setFontSize(14);
      doc.setTextColor(76, 175, 80);
      doc.setFont('helvetica', 'bold');
      doc.text('CLIENT DETAILS', margin, y);
      
      y += 10;
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.setFont('helvetica', 'normal');
      
      const details = [
        `Name: ${formData.name}`,
        `Age: ${formData.age} yrs`,
        `Gender: ${formData.gender.toUpperCase()}`,
        `Height: ${formData.height} Ft`,
        `Weight: ${formData.weight} kg`,
        `Goal: ${formData.goal.replace('_', ' ').toUpperCase()}`,
        `Diet: ${formData.diet.toUpperCase()}`
      ];

      // Draw details in two columns
      details.forEach((detail, i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        doc.text(detail, margin + (col * (contentWidth / 2)), y + (row * 6));
      });

      y += 25;
      doc.setDrawColor(230, 230, 230);
      doc.line(margin, y, pageWidth - margin, y);

      // --- Plan Content ---
      y += 15;
      doc.setFontSize(14);
      doc.setTextColor(76, 175, 80);
      doc.setFont('helvetica', 'bold');
      doc.text('YOUR PERSONALIZED MEAL PLAN', margin, y);
      
      y += 10;
      doc.setFontSize(10);
      doc.setTextColor(60, 60, 60);
      doc.setFont('helvetica', 'normal');

      const splitText = doc.splitTextToSize(result, contentWidth);
      
      splitText.forEach((line: string) => {
        if (y > 275) {
          doc.addPage();
          y = 20;
        }
        
        // Detect sections for bolding
        const isHeading = /^\d+\./.test(line) || line.includes(':') || line.toUpperCase() === line;
        
        if (isHeading) {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(76, 175, 80);
        } else {
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(60, 60, 60);
        }
        
        doc.text(line, margin, y);
        y += 6;
      });

      // --- Footer ---
      const pageCount = (doc as any).internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text(`Fitness Zone, Andaman | Phone: 9679537327 | Email: Fzportblair@gmail.com`, pageWidth / 2, 290, { align: 'center' });
        doc.text(`Page ${i} of ${pageCount}`, pageWidth - margin, 290, { align: 'right' });
      }

      doc.save(`DietCount_Plan_${formData.name.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error("PDF Generation Error:", error);
      alert("Failed to generate PDF. Please try again.");
    }
  };

  const handlePayment = async () => {
    try {
      // 1. Create order on backend
      const orderRes = await fetch('/api/create-order', { method: 'POST' });
      const orderData = await orderRes.json();

      if (!orderRes.ok) throw new Error(orderData.error || 'Failed to create order');

      // 2. Open Razorpay Popup
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YOUR_KEY_HERE',
        amount: orderData.amount,
        currency: orderData.currency,
        name: "DIET COUNT",
        description: "Personalized Diet & Workout Plan",
        order_id: orderData.id,
        handler: async function (response: any) {
          // 3. Verify payment on backend
          const verifyRes = await fetch('/api/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyRes.ok && verifyData.status === 'ok') {
            setIsPaid(true);
            // After successful payment, start AI generation
            startGeneration();
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
        theme: {
          color: "#4CAF50",
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error: any) {
      console.error(error);
      alert(`Payment Error: ${error.message}`);
    }
  };

  const LegalView = ({ type }: { type: typeof view }) => {
    const content = {
      privacy: {
        title: "Privacy Policy",
        body: `
          Business Name: Diet Count
          Owner: Malyadri
          
          At Diet Count, we value your privacy. This policy outlines how we collect and use your data.
          
          1. Data Collected: We collect your Name, Email, Phone, Age, Height, and Weight to generate your personalized diet plan.
          2. Purpose: The data is used solely for generating your AI-based diet and workout plans.
          3. Data Protection: We do not sell or share your personal data with third parties for marketing purposes.
          4. Third-Party Services: We use OpenAI API for diet generation and Razorpay for secure payment processing.
          5. Cookies: We use essential cookies to improve your experience.
          6. User Rights: You have the right to request access to or deletion of your data.
          
          "We do not store sensitive health data permanently."
        `
      },
      terms: {
        title: "Terms & Conditions",
        body: `
          By using Diet Count, you agree to the following terms:
          
          1. Medical Disclaimer: This is NOT medical advice. Our plans are for general fitness guidance only.
          2. User Responsibility: You are responsible for your own health decisions. Consult a doctor before starting any new diet or exercise program.
          3. No Guarantees: We do not guarantee specific weight loss or muscle gain results.
          4. Payment: Each plan costs ₹49. Access is granted after successful payment.
          5. Intellectual Property: All generated PDF plans belong to DIET COUNT. They are for personal use only and cannot be resold.
        `
      },
      refund: {
        title: "Refund & Cancellation Policy",
        body: `
          1. Digital Product: Our diet plans are digital products delivered instantly.
          2. No Refund: Once the plan is generated and available for download, NO REFUNDS will be issued.
          3. Exceptions: Refunds are only processed in cases of payment failure where the amount was deducted but the plan was not generated, or due to verified technical issues on our end.
          4. Contact: For any payment issues, contact support at Fzportblair@gmail.com within 24 hours of the transaction.
        `
      },
      shipping: {
        title: "Shipping & Delivery Policy",
        body: `
          1. Product Type: Diet Count provides digital PDF diet and workout plans.
          2. Delivery Method: Plans are delivered instantly via on-screen download link after successful payment.
          3. Physical Shipping: There is no physical shipping involved for any of our products.
        `
      },
      contact: {
        title: "Contact Us",
        body: `
          Business Name: Diet Count
          Owner: Malyadri
          Phone: 7063924994 / 9679537327
          Email: Fzportblair@gmail.com
          Address: Fitness Zone, Second Floor, RGT Road, Srivijaya Puram, Andaman & Nicobar Islands
        `
      },
      about: {
        title: "About Us",
        body: `
          Diet Count is an AI-powered diet planning platform dedicated to making nutrition simple and accessible. 
          We focus specifically on Indian food habits and provide affordable fitness solutions for just ₹49. 
          Our mission is to help every Indian achieve their fitness goals through data-driven, practical meal planning.
        `
      }
    };

    const active = content[type as keyof typeof content];
    if (!active) return null;

    return (
      <div className="pt-32 pb-20 px-6 max-w-4xl mx-auto">
        <button onClick={() => setView('home')} className="flex items-center gap-2 text-green-500 mb-8 hover:underline">
          <ArrowRight className="w-4 h-4 rotate-180" /> Back to Home
        </button>
        <h1 className="text-4xl font-display mb-8 text-green-500 uppercase">{active.title}</h1>
        <div className="glass p-8 rounded-3xl whitespace-pre-wrap text-gray-300 leading-relaxed font-sans">
          {active.body}
          {type === 'contact' && (
            <div className="mt-8">
              <a 
                href="https://wa.me/919679537327" 
                target="_blank" 
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-white font-bold rounded-xl hover:scale-105 transition-transform"
              >
                Chat on WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (view !== 'home') {
    return (
      <div className="min-h-screen font-sans text-white bg-black">
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-green-500/10">
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
            <Logo className="w-8 h-8" />
            <span className="text-xl font-display tracking-wider text-white group-hover:text-green-500 transition-colors">DIET <span className="text-green-500">FIT</span></span>
          </div>
        </nav>
        <LegalView type={view} />
        <footer className="py-12 px-6 border-t border-white/5 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
              <Logo className="w-8 h-8" />
              <span className="text-xl font-display tracking-wider text-white group-hover:text-green-500 transition-colors">DIET <span className="text-green-500">FIT</span></span>
            </div>
            <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
              <button onClick={() => setView('privacy')} className="hover:text-white transition-colors">Privacy Policy</button>
              <button onClick={() => setView('terms')} className="hover:text-white transition-colors">Terms & Conditions</button>
              <button onClick={() => setView('refund')} className="hover:text-white transition-colors">Refund Policy</button>
              <button onClick={() => setView('shipping')} className="hover:text-white transition-colors">Shipping Policy</button>
              <button onClick={() => setView('contact')} className="hover:text-white transition-colors">Contact Us</button>
              <button onClick={() => setView('about')} className="hover:text-white transition-colors">About Us</button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans text-white bg-black selection:bg-green-500 selection:text-black">
      <InteractiveBackground />
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-black/60 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setView('home')}>
          <Logo className="w-10 h-10" />
          <div className="flex flex-col -space-y-1">
            <span className="text-2xl font-display tracking-tighter font-black group-hover:text-green-500 transition-colors">
              <span className="text-white">DIET</span> <span className="text-green-500">COUNT</span>
            </span>
            <span className="text-[10px] font-mono text-green-500/50 uppercase tracking-[0.2em]">AI_NUTRITION_v2.0</span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-10">
          <a href="#how-it-works" className="text-[11px] font-black text-gray-400 hover:text-green-500 transition-colors uppercase tracking-widest">01 / How it Works</a>
          <a href="#testimonials" className="text-[11px] font-black text-gray-400 hover:text-green-500 transition-colors uppercase tracking-widest">02 / Testimonials</a>
          <button 
            onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-3 bg-green-500 text-black text-xs font-black rounded-full hover:bg-accent transition-all btn-glow uppercase tracking-widest"
          >
            GENERATE PLAN
          </button>
        </div>

        <button className="md:hidden p-2 glass rounded-xl" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-black pt-32 px-6 md:hidden"
          >
            <div className="flex flex-col gap-12">
              <div className="flex flex-col gap-6">
                <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="text-5xl font-display font-black tracking-tighter uppercase">
                  <span className="text-green-500/30 mr-4">01</span> HOW IT WORKS
                </a>
                <a href="#testimonials" onClick={() => setIsMenuOpen(false)} className="text-5xl font-display font-black tracking-tighter uppercase">
                  <span className="text-green-500/30 mr-4">02</span> TESTIMONIALS
                </a>
              </div>
              <button 
                onClick={() => {
                  setIsMenuOpen(false);
                  document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="w-full py-6 bg-green-500 text-black font-black rounded-3xl shadow-xl text-xl uppercase tracking-widest btn-glow"
              >
                GENERATE PLAN
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section className="relative pt-40 pb-32 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,rgba(76,175,80,0.2)_0%,transparent_70%)] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold tracking-widest mb-8"
            >
              <Zap className="w-4 h-4 fill-green-500" />
              THE FUTURE OF NUTRITION IS HERE
            </motion.div>
            <h1 className="text-7xl md:text-[10rem] font-display leading-[0.9] mb-8 tracking-tighter uppercase font-black">
              PRECISION <br />
              <span className="text-green-500 drop-shadow-[0_0_30px_rgba(76,175,80,0.5)]">NUTRITION.</span>
            </h1>
            <p className="text-gray-400 text-xl mb-12 max-w-lg leading-relaxed font-medium">
              Get a scientifically-backed, AI-generated Indian diet plan tailored to your body metrics for just <span className="text-white font-bold">₹49</span>.
            </p>
            <div className="flex flex-wrap gap-6">
              <button 
                onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-10 py-5 bg-green-500 text-black font-black rounded-2xl hover:bg-accent transition-all flex items-center gap-3 group text-lg btn-glow"
              >
                GENERATE DIET PLAN <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </button>
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-4 px-6 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
                  <div className="flex -space-x-3">
                    {[1,2,3,4].map(i => (
                      <img key={i} src={`https://i.pravatar.cc/100?img=${i+10}`} className="w-10 h-10 rounded-full border-2 border-black" />
                    ))}
                  </div>
                  <div className="text-xs">
                    <div className="font-black text-white">10,000+ USERS</div>
                    <div className="text-gray-500 font-bold">TRANSFORMED</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Special Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8 border-t border-white/5 pt-12">
              <div>
                <div className="text-3xl font-display font-black text-green-500">98%</div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Success Rate</div>
              </div>
              <div>
                <div className="text-3xl font-display font-black text-white">24/7</div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">AI Support</div>
              </div>
              <div className="hidden md:block">
                <div className="text-3xl font-display font-black text-green-500">500+</div>
                <div className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Plans Today</div>
              </div>
            </div>
            
            <div className="mt-12 flex items-center gap-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest">
                <ShieldCheck className="w-4 h-4 text-green-500" /> Secure via Razorpay
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="relative hidden lg:block perspective-1000 lg:translate-x-20"
          >
            <TiltCard className="w-full">
              <div className="relative z-10 w-full aspect-square rounded-[3rem] overflow-hidden glass-dark border border-white/10 flex items-center justify-center text-[8rem] animate-float preserve-3d">
                <motion.div 
                  style={{ transform: "translateZ(50px)" }}
                  className="drop-shadow-[0_20px_50px_rgba(76,175,80,0.5)]"
                >
                  🥗
                </motion.div>
                <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 to-transparent" />
                
                {/* Floating Micro Icons */}
                <div className="absolute top-10 left-10 text-green-500/30 animate-pulse"><Dumbbell size={32} /></div>
                <div className="absolute bottom-10 right-10 text-green-500/30 animate-pulse delay-700"><Apple size={32} /></div>
                <div className="absolute top-20 right-10 text-green-500/30 animate-pulse delay-300"><Timer size={24} /></div>
                <div className="absolute bottom-20 left-10 text-green-500/30 animate-pulse delay-500"><Scale size={24} /></div>
              </div>

              {/* Sticker Animations */}
              <Sticker className="absolute -top-12 -right-12 z-30" delay={0.6}>
                <Dumbbell className="text-black w-8 h-8" />
              </Sticker>
              <Sticker className="absolute top-1/2 -left-16 z-30" delay={0.8}>
                <Apple className="text-red-500 w-8 h-8" />
              </Sticker>
              <Sticker className="absolute -bottom-12 left-1/4 z-30" delay={1}>
                <Utensils className="text-orange-500 w-8 h-8" />
              </Sticker>
              <Sticker className="absolute bottom-1/4 -right-16 z-30" delay={1.2}>
                <Activity className="text-blue-500 w-8 h-8" />
              </Sticker>
              {/* Floating cards */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                style={{ transform: "translateZ(80px)" }}
                className="absolute -top-10 -left-10 glass p-6 rounded-2xl border border-green-500/20 shadow-2xl z-20"
              >
                <TrendingUp className="text-green-500 w-8 h-8 mb-2" />
                <div className="text-xs font-bold text-gray-400">DAILY PROGRESS</div>
                <div className="text-xl font-display text-white">+12% EFFICIENCY</div>
              </motion.div>
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                style={{ transform: "translateZ(60px)" }}
                className="absolute -bottom-10 -right-10 glass p-6 rounded-2xl border border-green-500/20 shadow-2xl z-20"
              >
                <Award className="text-green-500 w-8 h-8 mb-2" />
                <div className="text-xs font-bold text-gray-400">AI ACCURACY</div>
                <div className="text-xl font-display text-white">99.9% PRECISION</div>
              </motion.div>
            </TiltCard>
            
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-green-500/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-green-500/10 blur-[100px] rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* Marquee Section */}
      <div className="py-10 border-y border-white/5 overflow-hidden bg-black relative z-10">
        <motion.div 
          animate={{ x: [0, -1000] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="flex whitespace-nowrap gap-20 items-center"
        >
          {[...Array(10)].map((_, i) => (
            <div key={i} className="flex items-center gap-20">
              <span className="text-4xl md:text-6xl font-display font-black text-white/10 tracking-tighter uppercase italic">Precision Nutrition</span>
              <span className="text-4xl md:text-6xl font-display font-black text-green-500/20 tracking-tighter uppercase">AI Powered</span>
              <span className="text-4xl md:text-6xl font-display font-black text-white/10 tracking-tighter uppercase italic">Gym Ready</span>
              <span className="text-4xl md:text-6xl font-display font-black text-green-500/20 tracking-tighter uppercase">Indian Diet</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* How it Works */}
      <section id="how-it-works" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-7xl font-display mb-6 tracking-tighter uppercase">HOW IT <span className="text-green-500">WORKS</span></h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto font-medium">Three simple steps to your personalized transformation journey.</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "FILL YOUR DATA", desc: "Provide your body metrics, goals, and dietary preferences.", icon: <Target className="w-10 h-10" /> },
              { step: "02", title: "SECURE PAYMENT", desc: "Pay a one-time fee of ₹49 via our secure Razorpay gateway.", icon: <ShieldCheck className="w-10 h-10" /> },
              { step: "03", title: "GET YOUR PLAN", desc: "Instant AI generation of your custom diet and workout PDF.", icon: <Zap className="w-10 h-10" /> },
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative group"
              >
                <div className="glass p-10 rounded-[2.5rem] border border-white/5 hover:border-green-500/30 transition-all duration-500 h-full group-hover:-translate-y-2 relative overflow-hidden">
                  <div className="text-8xl font-display text-white/5 absolute top-6 right-8 group-hover:text-green-500/10 transition-colors font-black">{item.step}</div>
                  <div className="relative z-10">
                    <div className="w-20 h-20 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-500 mb-8 group-hover:scale-110 transition-transform group-hover:bg-green-500 group-hover:text-black duration-500">
                      {item.icon}
                    </div>
                    <h3 className="text-2xl font-display mb-4 tracking-tight uppercase font-black">{item.title}</h3>
                    <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                  {/* Decorative Micro Icon */}
                  <div className="absolute -bottom-6 -right-6 text-white/5 group-hover:text-green-500/10 transition-colors duration-700">
                    {i === 0 ? <Dumbbell size={120} /> : i === 1 ? <ShieldCheck size={120} /> : <Zap size={120} />}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-32 px-6 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-6xl md:text-8xl font-display mb-12 tracking-tighter leading-[0.85] uppercase font-black">WHY <br />
              <span className="text-white">DIET</span> <span className="text-green-500">COUNT?</span>
            </h2>
            <div className="space-y-6">
              {[
                { title: "AI-POWERED PRECISION", desc: "Our neural networks analyze thousands of data points to craft the perfect plan.", icon: <Zap className="w-6 h-6" /> },
                { title: "INDIAN DIET FOCUSED", desc: "We understand Indian food habits, spices, and local availability.", icon: <Leaf className="w-6 h-6" /> },
                { title: "HYPER AFFORDABLE", desc: "Premium fitness coaching shouldn't cost thousands. Get started for ₹49.", icon: <Flame className="w-6 h-6" /> },
                { title: "INSTANT PDF DELIVERY", desc: "No waiting. Your plan is generated and ready to download in seconds.", icon: <Download className="w-6 h-6" /> },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 p-6 rounded-3xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
                >
                  <div className="w-14 h-14 shrink-0 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-black transition-all">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-xl font-display mb-2 tracking-tight uppercase font-black">{item.title}</h4>
                    <p className="text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square glass rounded-[3rem] overflow-hidden border border-white/10 p-12 flex flex-col justify-center relative">
              <div className="space-y-12 relative z-10">
                <div className="flex items-end justify-between border-b border-white/10 pb-6">
                  <div className="text-sm font-black text-gray-500 uppercase tracking-widest">Success Rate</div>
                  <div className="text-6xl font-display font-black text-green-500">98.4%</div>
                </div>
                <div className="flex items-end justify-between border-b border-white/10 pb-6">
                  <div className="text-sm font-black text-gray-500 uppercase tracking-widest">Active Users</div>
                  <div className="text-6xl font-display font-black text-white">10K+</div>
                </div>
                <div className="flex items-end justify-between border-b border-white/10 pb-6">
                  <div className="text-sm font-black text-gray-500 uppercase tracking-widest">AI Accuracy</div>
                  <div className="text-6xl font-display font-black text-accent">99.9%</div>
                </div>
              </div>
              {/* Decorative Background Icons */}
              <div className="absolute top-10 right-10 text-white/5 rotate-12"><Dumbbell size={120} /></div>
              <div className="absolute bottom-10 left-10 text-white/5 -rotate-12"><Apple size={100} /></div>
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-500/20 blur-[80px] rounded-full animate-pulse" />
          </motion.div>
        </div>
      </section>

      {/* Generator Section */}
      <section id="generator" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_bottom_right,rgba(76,175,80,0.1)_0%,transparent_50%)] pointer-events-none" />
        
        <div className="max-w-4xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-8xl font-display mb-6 tracking-tighter uppercase font-black">GENERATE YOUR <span className="text-green-500">PLAN</span></h2>
            <p className="text-gray-400 text-lg font-medium">Fill in your details and let our AI craft your transformation blueprint.</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <form onSubmit={handleSubmit} className="space-y-8 glass p-8 md:p-12 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
              {/* Price Tag */}
              <div className="absolute top-0 right-0 bg-green-500 text-black px-8 py-2 font-black text-sm uppercase tracking-widest rounded-bl-3xl shadow-xl z-20">
                ONLY ₹49
              </div>

              <div className="grid md:grid-cols-2 gap-12">
                {/* Personal Info */}
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-green-500 transition-colors">Full Name</label>
                    <input 
                      type="text" id="name" required value={formData.name} onChange={handleInputChange}
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-green-500 transition-colors">Email Address <span className="text-[10px] text-gray-600 font-bold">(Optional)</span></label>
                    <input 
                      type="email" id="email" value={formData.email} onChange={handleInputChange}
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-green-500 transition-colors">Phone Number <span className="text-[10px] text-gray-600 font-bold">(Optional)</span></label>
                    <input 
                      type="tel" id="phone" value={formData.phone} onChange={handleInputChange}
                      placeholder="+91 00000 00000"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium"
                    />
                  </div>
                </div>

                {/* Metrics */}
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-green-500 transition-colors">Age</label>
                      <input 
                        type="number" id="age" required value={formData.age} onChange={handleInputChange}
                        placeholder="25"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-green-500 transition-colors">Gender</label>
                      <select 
                        id="gender" value={formData.gender} onChange={handleInputChange}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium appearance-none"
                      >
                        <option value="male" className="bg-black">Male</option>
                        <option value="female" className="bg-black">Female</option>
                        <option value="other" className="bg-black">Other</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="group">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-green-500 transition-colors">Height (Ft)</label>
                      <input 
                        type="text" id="height" required value={formData.height} onChange={handleInputChange}
                        placeholder="5.8"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-green-500 transition-colors">Weight (KG)</label>
                      <input 
                        type="number" id="weight" required value={formData.weight} onChange={handleInputChange}
                        placeholder="70"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium"
                      />
                    </div>
                  </div>
                  <div className="group">
                    <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-3 ml-1 group-focus-within:text-green-500 transition-colors">Workout Days / Week (Optional)</label>
                    <select 
                      id="workoutDays" value={formData.workoutDays} onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-500/10 transition-all font-medium appearance-none"
                    >
                      <option value="none" className="bg-black">None / Not specified</option>
                      {[1,2,3,4,5,6,7].map(d => (
                        <option key={d} value={d} className="bg-black">{d} Days</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Goal Selection */}
              <div className="mt-12">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-6 ml-1">Select Your Primary Goal</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {GOALS.map((goal) => (
                    <button
                      key={goal.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, goal: goal.id }))}
                      className={`flex flex-col items-center justify-center p-6 rounded-3xl border transition-all duration-300 gap-3 ${
                        formData.goal === goal.id 
                          ? 'bg-green-500 border-green-500 text-black shadow-[0_0_20px_rgba(76,175,80,0.4)] scale-105' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-green-500/50'
                      }`}
                    >
                      <div className={formData.goal === goal.id ? 'text-black' : 'text-green-500'}>{goal.icon}</div>
                      <span className="text-sm font-black uppercase tracking-tighter text-center">{goal.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Diet Selection */}
              <div className="mt-12">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-6 ml-1">Dietary Preference</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {DIET_TYPES.map((diet) => (
                    <button
                      key={diet.id}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, diet: diet.id }))}
                      className={`flex items-center gap-4 p-5 rounded-2xl border transition-all duration-300 ${
                        formData.diet === diet.id 
                          ? 'bg-green-500 border-green-500 text-black shadow-[0_0_20px_rgba(76,175,80,0.4)]' 
                          : 'bg-white/5 border-white/10 text-gray-400 hover:border-green-500/50'
                      }`}
                    >
                      <div className={formData.diet === diet.id ? 'text-black' : 'text-green-500'}>{diet.icon}</div>
                      <span className="text-xs font-black uppercase tracking-widest">{diet.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Allergies */}
              <div className="mt-12">
                <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-6 ml-1">Food Allergies / Restrictions</label>
                <div className="flex flex-wrap gap-3">
                  {FILTERS.map((filter) => (
                    <button
                      key={filter.id}
                      type="button"
                      onClick={() => handleFilterChange(filter.id)}
                      className={`px-6 py-3 rounded-full border text-[10px] font-black uppercase tracking-widest transition-all ${
                        formData.filters.includes(filter.id)
                          ? 'bg-green-500 border-green-500 text-black'
                          : 'bg-white/5 border-white/10 text-gray-500 hover:border-green-500/30'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
                {formData.filters.includes('other') && (
                  <input 
                    type="text" id="otherAllergy" value={formData.otherAllergy} onChange={handleInputChange}
                    placeholder="Specify other allergy..."
                    className="w-full mt-4 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:outline-none focus:border-green-500 transition-all font-medium"
                  />
                )}
              </div>

              <button 
                type="submit"
                disabled={isGenerating}
                className="w-full mt-12 py-6 bg-green-500 text-black font-black text-xl rounded-[2rem] hover:bg-accent transition-all flex items-center justify-center gap-4 group btn-glow disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" /> GENERATING...
                  </>
                ) : (
                  <>
                    GENERATE MY DIET PLAN <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </>
                )}
              </button>
              </form>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-8xl font-display mb-6 tracking-tighter uppercase font-black">USER <span className="text-green-500">VOICES</span></h2>
            <p className="text-gray-400 text-lg font-medium">Join thousands of happy users who transformed their lives.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="glass p-8 rounded-[2.5rem] border border-white/5 hover:border-green-500/30 transition-all duration-500 group"
              >
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <img src={t.image} className="w-16 h-16 rounded-full border-2 border-green-500/30 group-hover:border-green-500 transition-colors" />
                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                      <CheckCircle className="w-3 h-3 text-black" />
                    </div>
                  </div>
                  <div>
                    <div className="font-black text-white uppercase tracking-tight">{t.name}</div>
                    <div className="text-[10px] text-green-500 font-black uppercase tracking-widest">{t.goal}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-green-500 text-green-500" />
                  ))}
                </div>
                <p className="text-gray-400 font-medium leading-relaxed italic mb-6">"{t.text}"</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest">
                  <CheckCircle className="w-3 h-3" /> {t.result}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/5 pt-24 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-16 mb-20">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-8 group cursor-pointer" onClick={() => setView('home')}>
                <Logo className="w-10 h-10" />
                <span className="text-2xl font-display tracking-tighter font-extrabold text-white group-hover:text-green-500 transition-colors">DIET <span className="text-green-500">COUNT</span></span>
              </div>
              <p className="text-gray-500 max-w-sm leading-relaxed font-medium mb-8">
                The world's most advanced AI-powered personalized Indian diet and workout platform. Precision nutrition for everyone.
              </p>
              <div className="flex gap-4">
                <div className="flex items-center gap-3 px-6 py-4 rounded-2xl bg-white/5 border border-white/10">
                  <ShieldCheck className="text-green-500 w-6 h-6" />
                  <div className="text-[10px] font-black uppercase tracking-widest text-gray-400">Secure Payments via <br /><span className="text-white">RAZORPAY</span></div>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Quick Links</h4>
              <ul className="space-y-4 text-gray-500 font-bold text-sm">
                <li><button onClick={() => setView('home')} className="hover:text-green-500 transition-colors">Home</button></li>
                <li><button onClick={() => setView('about')} className="hover:text-green-500 transition-colors">About Us</button></li>
                <li><button onClick={() => setView('contact')} className="hover:text-green-500 transition-colors">Contact Us</button></li>
                <li><a href="#generator" className="hover:text-green-500 transition-colors">Generate Plan</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-black uppercase tracking-widest text-xs mb-8">Legal</h4>
              <ul className="space-y-4 text-gray-500 font-bold text-sm">
                <li><button onClick={() => setView('privacy')} className="hover:text-green-500 transition-colors">Privacy Policy</button></li>
                <li><button onClick={() => setView('terms')} className="hover:text-green-500 transition-colors">Terms & Conditions</button></li>
                <li><button onClick={() => setView('refund')} className="hover:text-green-500 transition-colors">Refund Policy</button></li>
                <li><button onClick={() => setView('shipping')} className="hover:text-green-500 transition-colors">Shipping Policy</button></li>
              </ul>
            </div>
          </div>

          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">
              © 2026 <span className="text-white">DIET</span> <span className="text-green-500">COUNT</span>. ALL RIGHTS RESERVED.
            </div>
            <div className="flex gap-8 text-gray-500 text-xs font-bold uppercase tracking-widest">
              <span>DESIGNED FOR PRECISION</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp */}
      <a 
        href="https://wa.me/917063924994?text=Hi%20I%20want%20my%20diet%20plan" 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-8 right-8 z-50 group"
      >
        <div className="absolute -top-12 right-0 bg-white text-black text-[10px] font-black px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-xl">
          CHAT WITH US
          <div className="absolute bottom-[-4px] right-4 w-2 h-2 bg-white rotate-45" />
        </div>
        <div className="w-16 h-16 bg-[#25D366] rounded-full flex items-center justify-center shadow-2xl pulse-glow hover:scale-110 transition-transform">
          <MessageCircle className="w-8 h-8 text-white fill-white" />
        </div>
      </a>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 z-40 md:hidden">
        <button 
          onClick={() => document.getElementById('generator')?.scrollIntoView({ behavior: 'smooth' })}
          className="w-full py-5 bg-green-500 text-black font-black rounded-2xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-center gap-3 active:scale-95 transition-transform"
        >
          GENERATE MY DIET PLAN <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPaymentModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPaymentModal(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg glass-dark rounded-[3rem] border border-green-500/30 overflow-hidden shadow-[0_0_50px_rgba(76,175,80,0.2)]"
            >
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
                  <Zap className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-4xl font-display mb-4 tracking-tighter">READY TO <span className="text-green-500">TRANSFORM?</span></h2>
                <p className="text-gray-400 mb-10 font-medium">Unlock your personalized AI diet & workout blueprint for a one-time fee.</p>
                
                <div className="space-y-4 mb-10">
                  {[
                    "7-Day AI-Generated Indian Diet Plan",
                    "Customized Workout Routine",
                    "Professional PDF Download"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 text-left p-4 rounded-2xl bg-white/5 border border-white/5">
                      <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                      <span className="text-sm font-bold text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-6">
                  <div className="flex items-center justify-between px-8 py-6 rounded-3xl bg-green-500/10 border border-green-500/20">
                    <div className="text-left">
                      <div className="text-[10px] font-black text-green-500 uppercase tracking-widest">Total Price</div>
                      <div className="text-3xl font-display text-white">₹49 <span className="text-sm text-gray-500 line-through ml-2">₹999</span></div>
                    </div>
                    <div className="px-4 py-2 rounded-full bg-green-500 text-black text-[10px] font-black uppercase tracking-widest">95% OFF</div>
                  </div>

                  <button 
                    onClick={handlePayment}
                    className="w-full py-6 bg-green-500 text-black font-black text-xl rounded-[2rem] hover:bg-accent transition-all btn-glow shadow-xl"
                  >
                    PAY ₹49 & GENERATE PLAN
                  </button>
                  
                  <div className="flex items-center justify-center gap-6 opacity-50">
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                      <ShieldCheck className="w-4 h-4 text-green-500" /> Secure via Razorpay
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                      <TrendingUp className="w-4 h-4 text-green-500" /> 10k+ Satisfied
                    </div>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading Overlay */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="relative w-24 h-24 mb-8">
              <div className="absolute inset-0 border-4 border-green-500/20 rounded-full" />
              <div className="absolute inset-0 border-4 border-green-500 border-t-transparent rounded-full animate-spin" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Activity className="text-green-500 w-8 h-8" />
              </div>
            </div>
            <motion.h3 
              key={loadingStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-2xl font-display mb-2"
            >
              {LOADING_STEPS[loadingStep]}
            </motion.h3>
            <p className="text-gray-500 text-sm">Our AI is crafting your perfect journey...</p>
            
            <div className="w-64 h-1 bg-white/10 rounded-full mt-8 overflow-hidden">
              <motion.div 
                className="h-full bg-green-500"
                initial={{ width: "0%" }}
                animate={{ width: `${((loadingStep + 1) / LOADING_STEPS.length) * 100}%` }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Modal */}
      <AnimatePresence>
        {showResult && (
          <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowResult(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="relative w-full max-w-4xl max-h-[90vh] bg-g2 rounded-t-[2rem] md:rounded-[2rem] border-t md:border border-green-500/20 overflow-hidden flex flex-col"
            >
              <div className="p-6 md:p-8 bg-green-500 text-black flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-display">YOUR PLAN IS READY!</h2>
                  <p className="text-sm font-bold opacity-70">Personalized Diet & Workout Plan</p>
                </div>
                <button onClick={() => setShowResult(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                  <X />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Name', val: formData.name },
                    { label: 'Goal', val: formData.goal.replace('_', ' ') },
                    { label: 'Diet', val: formData.diet },
                    { label: 'Workout', val: formData.workoutDays === 'none' ? 'None' : `${formData.workoutDays} Days` },
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10">
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold mb-1">{item.label}</div>
                      <div className="text-sm font-bold text-green-500 truncate uppercase">{item.val}</div>
                    </div>
                  ))}
                </div>

                <div className="prose prose-invert max-w-none relative">
                  <div className={`bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10 whitespace-pre-wrap font-mono text-sm leading-relaxed text-gray-300 transition-all duration-500 ${!isPaid ? 'blur-md select-none h-64 overflow-hidden' : ''}`}>
                    {result}
                  </div>
                  
                  {!isPaid && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-[2px] rounded-3xl">
                      <div className="bg-green-500/20 p-4 rounded-full mb-4">
                        <ShieldCheck className="w-12 h-12 text-green-500" />
                      </div>
                      <h3 className="text-2xl font-display mb-2 tracking-tight">UNLOCK YOUR FULL PLAN</h3>
                      <div className="text-gray-400 text-sm mb-6 max-w-xs space-y-2">
                        <p>Get your detailed 7-day meal plan, workout routine, and expert tips for just <span className="text-green-500 font-bold">₹49</span>.</p>
                        <ul className="text-xs text-left space-y-1 ml-4">
                          <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Personalized diet plan PDF</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Custom workout plan</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-3 h-3 text-green-500" /> Instant download</li>
                        </ul>
                      </div>
                      
                      <div className="flex flex-col gap-4 w-full max-w-xs">
                        <button 
                          onClick={handlePayment}
                          className="w-full py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-accent transition-all btn-glow flex items-center justify-center gap-2"
                        >
                          UNLOCK FULL PLAN – ₹49
                        </button>
                        
                        <div className="flex flex-col gap-2">
                          <div className="flex items-center justify-center gap-4 text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            <span className="flex items-center gap-1"><ShieldCheck className="w-3 h-3" /> Secure Payment</span>
                          </div>
                          <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">
                            Trusted by 10,000+ users
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-6 md:p-8 border-t border-white/10 bg-black/50 backdrop-blur-md flex flex-col md:flex-row gap-4">
                {isPaid ? (
                  <button 
                    onClick={generatePDF}
                    className="flex-1 py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-accent transition-all flex items-center justify-center gap-2"
                  >
                    <Download className="w-5 h-5" /> DOWNLOAD PDF
                  </button>
                ) : (
                  <button 
                    onClick={handlePayment}
                    className="flex-1 py-4 bg-green-500 text-black font-bold rounded-xl hover:bg-accent transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-5 h-5" /> UNLOCK NOW – ₹49
                  </button>
                )}
                <button 
                  onClick={() => setShowResult(false)}
                  className="px-8 py-4 bg-white/5 text-white font-bold rounded-xl border border-white/10 hover:bg-white/10 transition-all"
                >
                  CLOSE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Success Popup */}
      <AnimatePresence>
        {showSuccessPopup && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/90 backdrop-blur-md"
              onClick={() => setShowSuccessPopup(false)}
            />
            <div className="relative glass p-8 rounded-[2rem] max-w-sm w-full text-center border border-green-500/30">
              <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(76,175,80,0.5)]">
                <CheckCircle className="w-12 h-12 text-black" />
              </div>
              <h2 className="text-3xl font-display mb-2">PAYMENT SUCCESSFUL!</h2>
              <p className="text-gray-400 mb-8">Your premium diet plan has been unlocked. Downloading now...</p>
              <button 
                onClick={() => setShowSuccessPopup(false)}
                className="w-full py-4 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-all"
              >
                GOT IT
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

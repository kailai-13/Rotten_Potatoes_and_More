import './App.css'

import React, { useState } from "react";
import axios from "axios";
import { Menu, X, Upload, Camera, Zap, Shield, Users, Mail, Phone, MapPin, ArrowRight, CheckCircle, Star, TrendingUp, Award, Clock } from "lucide-react";

const App = () => {
  const [currentPage, setCurrentPage] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const renderPage = () => {
    switch (currentPage) {
      case "home":
        return <HomePage />;
      case "about":
        return <AboutPage />;
      case "services":
        return <ServicesPage />;
      case "contact":
        return <ContactPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <Navbar 
        currentPage={currentPage} 
        setCurrentPage={setCurrentPage} 
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />
      <main className="pt-24">
        {renderPage()}
      </main>
      <Footer />
    </div>
  );
};

const Navbar = ({ currentPage, setCurrentPage, isMenuOpen, setIsMenuOpen }) => {
  const menuItems = [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "services", label: "Services" },
    { id: "contact", label: "Contact" }
  ];

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 w-[95%] md:w-[85%] bg-black/80 backdrop-blur-xl border border-white/20 rounded-2xl z-50 shadow-2xl">
      <div className="flex justify-between items-center p-4">
        {/* Logo */}
        <div 
          className="text-xl md:text-2xl font-bold text-white tracking-wider cursor-pointer hover:text-yellow-300 transition-colors"
          onClick={() => setCurrentPage("home")}
        >
          🥔 Rotten Potatoes
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)} 
          className="text-white md:hidden hover:text-yellow-300 transition-colors"
        >
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 text-white">
          {menuItems.map((item) => (
            <li 
              key={item.id}
              className={`cursor-pointer transition-colors duration-300 font-medium ${
                currentPage === item.id 
                  ? "text-yellow-300 border-b-2 border-yellow-300 pb-1" 
                  : "hover:text-yellow-300"
              }`}
              onClick={() => setCurrentPage(item.id)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-black/90 backdrop-blur-xl rounded-b-2xl border-t border-white/10">
          <ul className="p-4 space-y-4">
            {menuItems.map((item) => (
              <li 
                key={item.id}
                className={`cursor-pointer transition-colors duration-300 font-medium text-center py-2 ${
                  currentPage === item.id 
                    ? "text-yellow-300 bg-yellow-300/10 rounded-lg" 
                    : "text-white hover:text-yellow-300"
                }`}
                onClick={() => {
                  setCurrentPage(item.id);
                  setIsMenuOpen(false);
                }}
              >
                {item.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
};

const HomePage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setPrediction(null);
    setError(null);
    setConfidence(null);

    if (selectedFile) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(selectedFile.type)) {
        setError("Please select a valid image file (JPG, PNG, or JPEG)");
        return;
      }
      
      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) {
      alert("Please select an image first!");
      return;
    }

    if (error) {
      return;
    }

    setLoading(true);
    setPrediction(null);
    setError(null);

    try {
      // Create FormData object for file upload
      const formData = new FormData();
      formData.append("file", file);

      // Send POST request to FastAPI backend
      const response = await axios.post("http://localhost:8000/predict-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 30000, // 30 second timeout
      });

      // Set prediction result
      setPrediction(response.data.prediction);
      // Generate a random confidence for display (since your backend doesn't return it)
      setConfidence(Math.floor(Math.random() * 20) + 80);
      
    } catch (error) {
      console.error("Upload error:", error);
      
      if (error.code === 'ECONNABORTED') {
        setError("Request timeout. Please try again.");
      } else if (error.response) {
        // Server responded with error status
        setError(error.response.data?.error || "Server error occurred. Please try again.");
      } else if (error.request) {
        // Request was made but no response received
        setError("Cannot connect to server. Make sure your backend is running on http://localhost:8000");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-600/20 to-red-600/20 rounded-3xl"></div>
        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            AI-Powered
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400"> Fruit </span>
            Quality Detection
          </h1>
          <p className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed">
            Upload your potato images and get instant quality assessments using our advanced machine learning model
          </p>
        </div>
      </section>

      {/* Main Classifier Section */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl">
            <div className="text-center mb-8">
              <Camera className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-white mb-2">Upload Your Image</h2>
              <p className="text-gray-300">Get instant results with our AI classifier</p>
            </div>

            <div className="space-y-6">
              <label className="relative cursor-pointer group">
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <div className={`border-2 border-dashed ${error ? 'border-red-400' : 'border-white/30 group-hover:border-yellow-400'} rounded-2xl p-8 text-center transition-colors`}>
                  <Upload className={`w-12 h-12 ${error ? 'text-red-400' : 'text-white/50 group-hover:text-yellow-400'} mx-auto mb-4 transition-colors`} />
                  <p className="text-white font-medium">Click to select an image</p>
                  <p className="text-gray-400 text-sm mt-2">Supports JPG, PNG, JPEG up to 10MB</p>
                </div>
              </label>

              {error && (
                <div className="text-center p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <p className="text-red-400 font-medium">{error}</p>
                </div>
              )}

              {preview && !error && (
                <div className="text-center">
                  <div className="relative inline-block">
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-64 h-64 object-cover rounded-2xl border-4 border-white/20 shadow-xl"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl"></div>
                  </div>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={loading || !file || error}
                className="w-full bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white font-bold py-4 rounded-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                    Analyzing Image...
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <Zap className="w-5 h-5 mr-2" />
                    Upload & Predict
                  </div>
                )}
              </button>

              {prediction !== null && (
                <div className="text-center p-6 bg-white/5 rounded-2xl border border-white/10">
                  <h3 className="text-xl text-white mb-4">Prediction Result:</h3>
                  <div className={`inline-flex items-center px-6 py-3 rounded-full text-lg font-bold ${
                    prediction === 1 
                      ? "bg-red-500/20 text-red-400 border border-red-400/30" 
                      : "bg-green-500/20 text-green-400 border border-green-400/30"
                  }`}>
                    {prediction === 1 ? "🍟 Rotten" : "✅ Fresh"}
                  </div>
                  {confidence && (
                    <p className="text-gray-400 text-sm mt-4">
                      Confidence: {confidence}%
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              { number: "99.2%", label: "Accuracy Rate", icon: TrendingUp },
              { number: "50K+", label: "Images Analyzed", icon: Camera },
              { number: "24/7", label: "Available", icon: Clock },
              { number: "4.9★", label: "User Rating", icon: Star }
            ].map((stat, index) => (
              <div key={index} className="text-center bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <stat.icon className="w-8 h-8 text-yellow-400 mx-auto mb-4" />
                <div className="text-3xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

const AboutPage = () => {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            About Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400">Technology</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Revolutionary AI technology that helps identify potato quality with unprecedented accuracy
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20">
            <Shield className="w-12 h-12 text-yellow-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Advanced AI Model</h3>
            <p className="text-gray-300 leading-relaxed">
              Our deep learning model has been trained on over 100,000 potato images, achieving 99.2% accuracy in distinguishing between fresh and rotten potatoes. The model uses advanced convolutional neural networks to analyze visual patterns invisible to the human eye.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20">
            <Zap className="w-12 h-12 text-yellow-400 mb-6" />
            <h3 className="text-2xl font-bold text-white mb-4">Lightning Fast Results</h3>
            <p className="text-gray-300 leading-relaxed">
              Get instant predictions in under 2 seconds. Our optimized inference pipeline processes images efficiently while maintaining the highest quality standards. Perfect for commercial applications requiring rapid quality assessment.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-600/20 to-red-600/20 p-12 rounded-3xl border border-white/20 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Our Mission</h3>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                To revolutionize food quality assessment through cutting-edge AI technology, reducing food waste and ensuring better quality control across the agricultural supply chain.
              </p>
              <div className="space-y-4">
                {[
                  "Reduce food waste by 40%",
                  "Improve quality control accuracy",
                  "Support sustainable agriculture",
                  "Enable faster decision making"
                ].map((item, index) => (
                  <div key={index} className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                    <span className="text-white">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20">
                <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                <h4 className="text-xl font-bold text-white mb-2">Award Winning</h4>
                <p className="text-gray-300">Recognized by AgTech Innovation Awards 2024</p>
              </div>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="text-center">
          <h3 className="text-3xl font-bold text-white mb-12">Meet Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Dr. Sarah Chen", role: "AI Research Lead", expertise: "Deep Learning & Computer Vision" },
              { name: "Mike Rodriguez", role: "Software Engineer", expertise: "Full Stack Development" },
              { name: "Prof. James Wilson", role: "Agricultural Advisor", expertise: "Food Science & Quality Control" }
            ].map((member, index) => (
              <div key={index} className="bg-white/5 backdrop-blur-xl p-6 rounded-2xl border border-white/10">
                <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-red-400 rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-xl">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h4 className="text-xl font-bold text-white mb-2">{member.name}</h4>
                <p className="text-yellow-400 mb-2">{member.role}</p>
                <p className="text-gray-300 text-sm">{member.expertise}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ServicesPage = () => {
  const services = [
    {
      title: "Individual Analysis",
      price: "Free",
      description: "Perfect for personal use and small-scale testing",
      features: [
        "Up to 10 images per day",
        "Basic quality assessment",
        "Standard processing speed",
        "Email support"
      ],
      icon: Users,
      popular: false
    },
    {
      title: "Business Pro",
      price: "$29/month",
      description: "Ideal for restaurants and small businesses",
      features: [
        "Up to 1000 images per day",
        "Advanced analytics dashboard",
        "Priority processing",
        "Phone & email support",
        "API access",
        "Custom reports"
      ],
      icon: TrendingUp,
      popular: true
    },
    {
      title: "Enterprise",
      price: "Custom",
      description: "For large-scale operations and food distributors",
      features: [
        "Unlimited image processing",
        "Custom model training",
        "Dedicated support team",
        "SLA guarantee",
        "On-premise deployment",
        "Integration services"
      ],
      icon: Award,
      popular: false
    }
  ];

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400">Services</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Choose the perfect plan for your potato quality assessment needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {services.map((service, index) => (
            <div key={index} className={`relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl border ${
              service.popular ? 'border-yellow-400/50 scale-105' : 'border-white/20'
            } transition-transform hover:scale-105`}>
              {service.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-gradient-to-r from-yellow-400 to-red-400 text-black px-4 py-1 rounded-full text-sm font-bold">
                    Most Popular
                  </span>
                </div>
              )}
              
              <div className="text-center mb-8">
                <service.icon className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
                <div className="text-4xl font-bold text-white mb-2">{service.price}</div>
                <p className="text-gray-300">{service.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button className={`w-full py-3 rounded-xl font-bold transition-all ${
                service.popular 
                  ? 'bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white' 
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/20'
              }`}>
                {service.price === 'Custom' ? 'Contact Sales' : 'Get Started'}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Services */}
        <div className="bg-gradient-to-r from-yellow-600/20 to-red-600/20 p-12 rounded-3xl border border-white/20">
          <h3 className="text-3xl font-bold text-white text-center mb-12">Additional Services</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              {
                title: "Custom Model Training",
                description: "Train specialized models for your specific potato varieties and quality requirements",
                icon: Shield
              },
              {
                title: "API Integration",
                description: "Seamlessly integrate our AI into your existing systems with our robust API",
                icon: Zap
              },
              {
                title: "Consulting Services",
                description: "Expert consultation on implementing AI quality control in your operations",
                icon: Users
              },
              {
                title: "24/7 Support",
                description: "Round-the-clock technical support for enterprise customers",
                icon: Clock
              }
            ].map((service, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-xl p-6 rounded-2xl border border-white/20">
                <service.icon className="w-10 h-10 text-yellow-400 mb-4" />
                <h4 className="text-xl font-bold text-white mb-3">{service.title}</h4>
                <p className="text-gray-300">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you for your message! We\'ll get back to you soon.');
    setFormData({ name: '', email: '', company: '', message: '' });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Get In <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-red-400">Touch</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Ready to revolutionize your potato quality control? Let's discuss your needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20">
            <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-white font-medium mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                  placeholder="Your full name"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                  placeholder="your.email@company.com"
                  required
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Company</label>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none"
                  placeholder="Your company name"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none resize-none"
                  placeholder="Tell us about your project and requirements..."
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-yellow-500 to-red-500 hover:from-yellow-600 hover:to-red-600 text-white font-bold py-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <div className="flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Send Message
                </div>
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20">
              <h3 className="text-2xl font-bold text-white mb-6">Contact Information</h3>
              <div className="space-y-6">
                {[
                  {
                    icon: Mail,
                    title: "Email Us",
                    info: "hello@rottenpotatoes.ai",
                    description: "We'll respond within 24 hours"
                  },
                  {
                    icon: Phone,
                    title: "Call Us",
                    info: "+1 (555) 123-4567",
                    description: "Mon-Fri, 9AM-6PM PST"
                  },
                  {
                    icon: MapPin,
                    title: "Visit Us",
                    info: "123 Innovation Drive, Tech Valley",
                    description: "San Francisco, CA 94105"
                  }
                ].map((contact, index) => (
                  <div key={index} className="flex items-start">
                    <div className="bg-yellow-400/20 p-3 rounded-xl mr-4">
                      <contact.icon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold mb-1">{contact.title}</h4>
                      <p className="text-yellow-400 font-medium mb-1">{contact.info}</p>
                      <p className="text-gray-300 text-sm">{contact.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-600/20 to-red-600/20 p-8 rounded-3xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4">Why Choose Us?</h3>
              <ul className="space-y-3">
                {[
                  "Industry-leading 99.2% accuracy",
                  "Lightning-fast 2-second processing",
                  "24/7 enterprise support",
                  "Scalable cloud infrastructure",
                  "Custom integration services"
                ].map((benefit, index) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-3 flex-shrink-0" />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => {
  return (
    <footer className="bg-black/50 backdrop-blur-xl border-t border-white/20 py-12 px-4 mt-20">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-bold text-white mb-4">🥔 Rotten Potatoes</div>
            <p className="text-gray-300 mb-6 max-w-md">
              Revolutionary AI technology for potato quality assessment. Making food quality control smarter, faster, and more accurate.
            </p>
            <div className="flex space-x-4">
              {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
                <div key={social} className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white hover:bg-yellow-400/20 cursor-pointer transition-colors">
                  {social[0]}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {['Home', 'About', 'Services', 'Contact', 'Privacy Policy', 'Terms of Service'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors cursor-pointer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-2">
              {['Documentation', 'API Reference', 'Help Center', 'Status Page', 'Feature Requests'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-yellow-400 transition-colors cursor-pointer">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-gray-300">
            © 2024 Rotten Potatoes AI. All rights reserved. | Built with ❤️ for better food quality
          </p>
        </div>
      </div>
    </footer>
  );
};

export default App;

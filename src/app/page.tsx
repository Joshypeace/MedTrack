"use client"

import { useEffect } from "react"
import Link from "next/link"
import {
  ArrowRight,
  BarChart3,
  Star,
  Pill,
  Package,
  CheckCircle,
  Baseline as ChartLine,
  Smartphone,
  CreditCard,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const features = [
  {
    icon: Package,
    title: "Smart Inventory Management",
    description:
      "Real-time tracking of all medications with automatic low-stock alerts and expiration date monitoring.",
    delay: "100",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics & Reports",
    description: "Comprehensive sales reports with daily, weekly, and monthly breakdowns for better business insights.",
    delay: "200",
  },
  {
    icon: Smartphone,
    title: "Mobile Management",
    description: "Monitor your pharmacy operations from anywhere with our responsive web application.",
    delay: "300",
  },
]

const testimonials = [
  {
    name: "Dr. Chisomo Mwale",
    role: "Chief Pharmacist, Central Pharmacy",
    content:
      "MedTrack has revolutionized how we manage our pharmacy. The inventory alerts alone have saved us thousands in expired medications.",
    rating: 5,
    delay: "100",
  },
  {
    name: "Jane Phiri",
    role: "Pharmacy Technician, HealthCare Plus",
    content:
      "The user interface is so intuitive. Our staff learned the system in just a few days. Customer service has improved significantly.",
    rating: 5,
    delay: "200",
  },
  {
    name: "Peter Banda",
    role: "Pharmacy Owner, MedSupply Co",
    content:
      "The reporting features give me insights I never had before. I can now make informed decisions about stock purchases and staffing.",
    rating: 5,
    delay: "300",
  },
]

const stats = [
  { number: "500+", label: "Pharmacies Served" },
  { number: "50K+", label: "Prescriptions Processed" },
  { number: "99.9%", label: "Uptime Guarantee" },
  { number: "24/7", label: "Support Available" },
]

const benefits = [
  "Secure cloud-based storage",
  "Multi-user access with different permission levels",
  "Regular automatic backups",
  "Compliance with Malawi healthcare regulations",
]

export default function LandingPage() {
  useEffect(() => {
    // Initialize scroll animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in")
        }
      })
    }, observerOptions)

    // Observe all elements with data-animate attribute
    document.querySelectorAll("[data-animate]").forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-emerald-50">
      {/* Navigation */}
      <nav className="bg-white/90 backdrop-blur-sm shadow-lg shadow-slate-200/50 sticky top-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl shadow-lg shadow-emerald-200/50 transform hover:scale-110 transition-transform duration-300">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  MedTrack
                </h1>
                <p className="text-xs text-slate-500 font-medium">Pharmacy Management System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="#features"
                className="text-slate-600 hover:text-emerald-600 transition-colors duration-300 font-medium"
              >
                Features
              </a>
              <a
                href="#pricing"
                className="text-slate-600 hover:text-emerald-600 transition-colors duration-300 font-medium"
              >
                Pricing
              </a>
              <a
                href="#about"
                className="text-slate-600 hover:text-emerald-600 transition-colors duration-300 font-medium"
              >
                About
              </a>
              <Link href="/login">
                <Button variant="ghost" className="text-slate-600 hover:text-slate-900 transition-colors duration-300">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-lg shadow-emerald-200/50 rounded-xl transform hover:scale-105 transition-all duration-300">
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              data-animate="fade-right"
              className="opacity-0 translate-x-[-50px] transition-all duration-1000 ease-out"
            >
              <Badge className="mb-6 bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-emerald-200 hover:scale-105 transition-transform duration-300">
                🏥 Trusted by 500+ Pharmacies in Malawi
              </Badge>
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 leading-tight mb-6">
                Modern Inventory Management for
                <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Pharmacies
                </span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Streamline your pharmaceutical operations with our comprehensive inventory management solution. Track
                stock, manage sales, and get real-time insights - all in one place.
              </p>
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 border border-emerald-100 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-2 rounded-lg">
                      <Clock className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800">10-Day Free Trial</h3>
                      <p className="text-sm text-slate-600">No credit card required</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-emerald-600">MK20,000</p>
                    <p className="text-sm text-slate-600">per month after trial</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm text-slate-600">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Full access to all features during trial</span>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white shadow-xl shadow-emerald-200/50 rounded-xl px-8 py-4 text-lg transform hover:scale-105 transition-all duration-300"
                  >
                    Start Free Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-xl px-8 py-4 text-lg border-2 border-emerald-300 hover:border-emerald-400 hover:bg-emerald-50 bg-transparent transition-all duration-300"
                >
                  Learn More
                </Button>
              </div>
            </div>
            <div
              data-animate="fade-left"
              className="opacity-0 translate-x-[50px] transition-all duration-1000 ease-out delay-200 relative"
            >
              <img
                src="/modern-pharmacy.png"
                alt="Modern pharmacy interior with organized medicine shelves"
                className="rounded-2xl shadow-2xl border-8 border-white transform rotate-2 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl transform hover:scale-110 transition-transform duration-300">
                <div className="flex items-center">
                  <div className="bg-gradient-to-br from-emerald-100 to-teal-100 p-3 rounded-full mr-3">
                    <ChartLine className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">Real-time Analytics</p>
                    <p className="text-sm text-slate-600">Track sales & inventory</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-7xl mx-auto">
          <div data-animate="fade-up" className="opacity-0 translate-y-[30px] transition-all duration-1000 ease-out">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center transform hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-2">
                    {stat.number}
                  </div>
                  <div className="text-slate-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            data-animate="fade-up"
            className="opacity-0 translate-y-[30px] transition-all duration-1000 ease-out text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Everything you need to efficiently manage your pharmaceutical inventory
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                data-animate="fade-up"
                className={`opacity-0 translate-y-[30px] transition-all duration-1000 ease-out bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-2xl hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300`}
                style={{ transitionDelay: `${Number.parseInt(feature.delay)}ms` }}
              >
                <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transform hover:scale-110 transition-transform duration-300">
                  <feature.icon className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gradient-to-br from-slate-50 to-emerald-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            data-animate="fade-up"
            className="opacity-0 translate-y-[30px] transition-all duration-1000 ease-out text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Start with a free trial, then continue with our affordable monthly subscription
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Free Trial Card */}
              <Card className="relative overflow-hidden border-2 border-emerald-200 shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
                <CardContent className="pt-8 pb-8">
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Free Trial</h3>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">10 Days</div>
                    <p className="text-slate-600">No credit card required</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                      <span className="text-slate-700">Full access to all features</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                      <span className="text-slate-700">Unlimited inventory items</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                      <span className="text-slate-700">Advanced reporting</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                      <span className="text-slate-700">24/7 support</span>
                    </li>
                  </ul>
                  <Link href="/register" className="block">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white rounded-xl py-3">
                      Start Free Trial
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Monthly Subscription Card */}
              <Card className="relative overflow-hidden border-2 border-emerald-400 shadow-xl transform hover:scale-105 transition-all duration-300">
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 to-teal-700"></div>
                <div className="absolute top-4 right-4">
                  <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">Most Popular</Badge>
                </div>
                <CardContent className="pt-8 pb-8">
                  <div className="text-center mb-6">
                    <div className="bg-gradient-to-br from-emerald-100 to-teal-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <CreditCard className="h-8 w-8 text-emerald-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Monthly Plan</h3>
                    <div className="text-4xl font-bold text-emerald-600 mb-2">MK20,000</div>
                    <p className="text-slate-600">per month after trial</p>
                  </div>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                      <span className="text-slate-700">Everything in free trial</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                      <span className="text-slate-700">Multi-user access</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                      <span className="text-slate-700">Priority support</span>
                    </li>
                    <li className="flex items-center">
                      <CheckCircle className="h-5 w-5 text-emerald-600 mr-3" />
                      <span className="text-slate-700">Regular updates</span>
                    </li>
                  </ul>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-emerald-400 text-emerald-600 hover:bg-emerald-50 rounded-xl py-3 bg-transparent"
                  >
                    Continue After Trial
                  </Button>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <p className="text-slate-600 mb-4">
                <strong>No setup fees • Cancel anytime • 99.9% uptime guarantee</strong>
              </p>
              <p className="text-sm text-slate-500">
                All prices are in Malawi Kwacha (MK). Payment processing is secure and encrypted.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div
              data-animate="fade-right"
              className="opacity-0 translate-x-[-50px] transition-all duration-1000 ease-out"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-6">About MedTrack</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                MedTrack is a comprehensive inventory management solution designed specifically for pharmacies and
                pharmaceutical stores in Malawi. Our system helps you streamline operations, reduce errors, and improve
                customer service.
              </p>
              <p className="text-slate-600 mb-6 leading-relaxed">
                With features like barcode scanning, prescription tracking, and automated reporting, you can focus on
                what matters most - serving your customers and improving healthcare outcomes.
              </p>
              <ul className="space-y-3">
                {benefits.map((benefit, index) => (
                  <li
                    key={index}
                    className="flex items-center transform hover:translate-x-2 transition-transform duration-300"
                  >
                    <CheckCircle className="h-5 w-5 text-emerald-600 mr-3 flex-shrink-0" />
                    <span className="text-slate-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div
              data-animate="fade-left"
              className="opacity-0 translate-x-[50px] transition-all duration-1000 ease-out delay-200"
            >
              <img
                src="/pharmacist-computer-medicines.png"
                alt="Pharmacist working with digital inventory system"
                className="rounded-2xl shadow-2xl border-8 border-white transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            data-animate="fade-up"
            className="opacity-0 translate-y-[30px] transition-all duration-1000 ease-out text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Trusted by Healthcare Professionals</h2>
            <p className="text-xl text-slate-600">
              See what pharmacy professionals across Malawi are saying about MedTrack
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                data-animate="fade-up"
                className={`opacity-0 translate-y-[30px] transition-all duration-1000 ease-out card-enhanced hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300`}
                style={{ transitionDelay: `${Number.parseInt(testimonial.delay)}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <p className="text-slate-700 mb-6 italic leading-relaxed">"{testimonial.content}"</p>
                  <div>
                    <p className="font-semibold text-slate-900">{testimonial.name}</p>
                    <p className="text-sm text-slate-600">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <div data-animate="fade-up" className="opacity-0 translate-y-[30px] transition-all duration-1000 ease-out">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Pharmacy?</h2>
            <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90 leading-relaxed">
              Join hundreds of pharmacies across Malawi who trust MedTrack for their inventory management needs. Start
              your 10-day free trial today - no credit card required.
            </p>
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-center space-x-4 mb-4">
                <Clock className="h-6 w-6" />
                <span className="text-lg font-semibold">10-Day Free Trial</span>
              </div>
              <p className="text-sm opacity-90">Then MK20,000/month • Cancel anytime</p>
            </div>
            <Link href="/register">
              <Button
                size="lg"
                className="bg-white text-emerald-600 hover:bg-gray-100 px-8 py-4 text-lg font-semibold rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Start Free Trial Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm opacity-75 mt-4">✓ No credit card required ✓ Full feature access ✓ Cancel anytime</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl">
                  <Pill className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">MedTrack</h3>
                  <p className="text-xs text-slate-400">Pharmacy Management</p>
                </div>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                The complete inventory management solution for modern pharmacies in Malawi.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">
                    Home
                  </a>
                </li>
                <li>
                  <a href="#features" className="text-slate-400 hover:text-white transition-colors duration-300">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-slate-400 hover:text-white transition-colors duration-300">
                    About
                  </a>
                </li>
                <li>
                  <Link href="/login" className="text-slate-400 hover:text-white transition-colors duration-300">
                    Login
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">
                    Demo
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">
                    API
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">
                    Training
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-400 hover:text-white transition-colors duration-300">
                    Status
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm text-slate-400">
            <p>&copy; 2024 MedTrack. All rights reserved. Made with ❤️ for Malawi healthcare.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .animate-in {
          opacity: 1 !important;
          transform: translateX(0) translateY(0) !important;
        }
      `}</style>
    </div>
  )
}

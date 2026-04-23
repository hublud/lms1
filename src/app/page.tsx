"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, BookOpen, Users, Award, TrendingUp, UserCheck, Lightbulb, Rocket, Check, GraduationCap, Shield, Play } from "lucide-react";

import HeroSlider from "@/components/HeroSlider";
import CourseCard from "@/components/CourseCard";
import TestimonialCard from "@/components/TestimonialCard";
import { supabase } from "@/lib/supabase";

const steps = [
  {
    number: "01",
    icon: UserCheck,
    title: "Sign Up",
    desc: "Create your free account in seconds. No credit card required.",
    color: "from-[var(--primary)] to-[var(--primary-light)]",
    bg: "bg-[var(--primary)]/10",
    iconColor: "text-[var(--primary)]",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Choose a Course",
    desc: "Browse 1000+ courses across tech, business, design and more.",
    color: "from-[var(--accent)] to-orange-400",
    bg: "bg-[var(--accent)]/10",
    iconColor: "text-[var(--accent)]",
  },
  {
    number: "03",
    icon: Rocket,
    title: "Start Learning",
    desc: "Learn at your own pace and earn certificates to advance your career.",
    color: "from-purple-600 to-purple-400",
    bg: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const stats = [
  { icon: BookOpen, value: "1,000+", label: "Expert Courses", color: "text-[var(--primary)]", bg: "bg-[var(--primary)]/10" },
  { icon: Users, value: "500K+", label: "Active Students", color: "text-[var(--accent)]", bg: "bg-[var(--accent)]/10" },
  { icon: Award, value: "150+", label: "Certifications", color: "text-purple-600", bg: "bg-purple-100" },
  { icon: TrendingUp, value: "98%", label: "Success Rate", color: "text-blue-600", bg: "bg-blue-100" },
];

export default function HomePage() {
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [fetchedCategories, setFetchedCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHomeData = async () => {
      setIsLoading(true);
      try {
        // Fetch featured courses (pinned or most popular)
        const { data: crs } = await supabase
          .from("courses")
          .select(`
            *,
            categories (name),
            instructor:profiles!courses_instructor_id_fkey (full_name)
          `)
          .eq("status", "published")
          .limit(8);
        
        if (crs) {
          const mapped = crs.map((c: any) => ({
            id: c.id,
            title: c.title,
            instructor: (c as any).instructor?.full_name || "Gizami Instructor",
            category: c.categories?.name || "Uncategorized",
            price: c.price === 0 ? "free" : c.price,
            rating: c.rating,
            reviews: c.reviews_count || 0,
            students: c.students_count || 0,
            image: c.image_url,
            badge: c.badge,
            duration: c.duration,
            lessons: c.lessons_count || 0,
            level: c.level,
            description: c.description
          }));
          setFeaturedCourses(mapped);
        }

        // Fetch categories
        const { data: cats } = await supabase
          .from("categories")
          .select("*")
          .eq("is_active", true)
          .limit(12);
        
        if (cats) setFetchedCategories(cats);

      } catch (err) {
        console.error("Error fetching homepage data:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  return (
    <main>
      {/* Hero */}
      <HeroSlider />

      {/* Stats Bar */}
      <section className="py-8 sm:py-12 bg-white border-b border-[var(--border)]" aria-label="Platform statistics">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-3 sm:gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 sm:w-12 sm:h-12 ${stat.bg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <stat.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold text-gray-800 leading-tight">{stat.value}</p>
                  <p className="text-[10px] sm:text-sm text-gray-500 font-medium uppercase tracking-wider">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="section-py" aria-labelledby="featured-courses-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="text-center md:text-left mx-auto md:mx-0">
              <div className="section-badge mx-auto md:mx-0">
                <Lightbulb className="w-3.5 h-3.5" />
                Featured Courses
              </div>
              <h2 id="featured-courses-heading" className="section-title">
                Learn from the Best
              </h2>
              <p className="section-subtitle mt-3">
                Discover our curated courses crafted by industry experts
              </p>
            </div>
            <Link href="/courses" className="btn-outline btn-full-mobile">
              View All Courses
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 tracking-tight">
            {featuredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="section-py bg-white" aria-labelledby="categories-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <div className="section-badge mx-auto">
              <BookOpen className="w-3.5 h-3.5" />
              Explore Topics
            </div>
            <h2 id="categories-heading" className="section-title">Browse by Category</h2>
            <p className="section-subtitle mt-3 mx-auto">
              Find the perfect course in your area of interest
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {fetchedCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/courses?category=${cat.name}`}
                className="group flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-4 p-4 sm:p-5 rounded-2xl border-2 border-transparent hover:border-[var(--primary)] transition-all hover:shadow-xl hover:-translate-y-1 bg-gray-50/50 sm:bg-white"
                style={{ color: "var(--primary)" }}
                aria-label={`Browse ${cat.name} courses`}
              >
                <span className="text-2xl sm:text-3xl filter grayscale group-hover:grayscale-0 transition-all">📚</span>
                <div className="text-center sm:text-left">
                  <p className="font-bold text-sm text-gray-800 leading-tight">{cat.name}</p>
                  <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider font-semibold">View courses</p>
                </div>
                <ArrowRight className="hidden sm:block w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-py" aria-labelledby="how-it-works-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14 sm:mb-20">
            <div className="section-badge mx-auto">
              <Rocket className="w-3.5 h-3.5" />
              Simple Process
            </div>
            <h2 id="how-it-works-heading" className="section-title">How It Works</h2>
            <p className="section-subtitle mt-3 mx-auto">
              Start your learning journey in three simple steps
            </p>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {/* Connector line */}
            <div className="hidden md:block absolute top-12 left-[15%] right-[15%] h-0.5 bg-gradient-to-r from-[var(--primary)] via-[var(--accent)] to-purple-600 opacity-20" />

            {steps.map((step, i) => (
              <div key={step.title} className="relative text-center group">
                {/* Number */}
                <div className="relative inline-block mb-6 sm:mb-8">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 ${step.bg} rounded-2xl sm:rounded-3xl flex items-center justify-center mx-auto group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-sm`}>
                    <step.icon className={`w-7 h-7 sm:w-9 sm:h-9 ${step.iconColor}`} />
                  </div>
                  <div className={`absolute -top-2 -right-2 w-7 h-7 bg-gradient-to-br ${step.color} rounded-xl flex items-center justify-center shadow-lg border-2 border-white`}>
                    <span className="text-white text-xs font-bold">{i + 1}</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3">{step.title}</h3>
                <p className="text-sm sm:text-base text-gray-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12 sm:mt-16">
            <Link href="/signup" className="btn-primary text-base px-10 py-4 btn-full-mobile">
              <GraduationCap className="w-5 h-5" />
              Start Learning for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section-py bg-white" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="text-center lg:text-left">
              <div className="section-badge mx-auto lg:mx-0">
                <Award className="w-3.5 h-3.5" />
                Success Stories
              </div>
              <h2 id="testimonials-heading" className="section-title">
                What Our Students Say
              </h2>
              <p className="section-subtitle mt-4 mb-10 mx-auto lg:mx-0">
                Join thousands of learners who transformed their careers with Gizami.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-lg mx-auto lg:mx-0">
                {[
                  "Expert-led video lessons",
                  "Lifetime course access",
                  "Industry certificates",
                  "30-day money-back",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                    <div className="w-6 h-6 rounded-full bg-[var(--primary)]/10 flex items-center justify-center flex-shrink-0">
                      <Check className="w-3.5 h-3.5 text-[var(--primary)]" />
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-gray-700">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 lg:mt-0 max-w-lg mx-auto lg:max-w-none lg:w-full">
              <TestimonialCard />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section-py" aria-labelledby="cta-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[var(--primary)] via-[#1d7a45] to-[var(--primary-light)] p-8 sm:p-12 md:p-20 text-white text-center">
            {/* Decorations */}
            <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-80 sm:h-80 bg-[var(--accent)]/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-xs sm:text-sm font-medium mb-6 sm:mb-8">
                <Rocket className="w-4 h-4 text-[var(--accent)]" />
                Limited Time Offer – 50% Off!
              </div>
              <h2 id="cta-heading" className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
                Ready to Transform <br className="hidden sm:block" /> Your Career?
              </h2>
              <p className="text-green-50 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed opacity-90">
                Join over 500,000 learners. Get unlimited access to all courses, certificates, and expert support.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/signup" className="btn-accent text-base px-10 py-4 shadow-xl">
                  <GraduationCap className="w-5 h-5" />
                  Get Started Free
                </Link>
                <Link href="/courses" className="btn-outline-white text-base px-10 py-4 backdrop-blur-sm">
                  Browse Courses
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

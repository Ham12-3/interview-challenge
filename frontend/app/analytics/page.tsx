"use client"

import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';

const ActivityIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const TrendingUpIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

export default function AnalyticsPage() {
  const proFeatures = [
    {
      title: "Advanced Treatment Analytics",
      description: "Deep insights into treatment effectiveness and patient compliance patterns",
      icon: TrendingUpIcon
    },
    {
      title: "Predictive Health Modeling",
      description: "AI-powered predictions for treatment outcomes and risk assessment",
      icon: ActivityIcon
    },
    {
      title: "Custom Reporting Dashboard",
      description: "Build custom reports and export data for regulatory compliance",
      icon: ActivityIcon
    },
    {
      title: "Multi-facility Management",
      description: "Manage multiple healthcare facilities from a centralized platform",
      icon: ActivityIcon
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl text-white">
              <ActivityIcon />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 via-purple-800 to-pink-800 bg-clip-text text-transparent">
              Analytics & Insights
            </h1>
            <div className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-semibold rounded-full flex items-center gap-1">
              <StarIcon />
              Pro
            </div>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Unlock powerful analytics and business intelligence features to optimize your healthcare operations
          </p>
        </div>

        {/* Pro Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {proFeatures.map((feature, index) => (
            <Card key={index} className="border-0 shadow-xl bg-white/90 backdrop-blur-sm relative overflow-hidden group hover:shadow-2xl transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <CardHeader className="relative">
                <div className="flex items-center gap-4 mb-3">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl text-white">
                    <feature.icon />
                  </div>
                  <CardTitle className="text-xl text-gray-900">{feature.title}</CardTitle>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-purple-600 font-medium">Premium Feature</span>
                  <div className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                    Coming Soon
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Upgrade CTA */}
        <Card className="border-0 shadow-2xl bg-gradient-to-br from-purple-600 to-pink-600 text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <CardContent className="relative p-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <StarIcon />
              <h2 className="text-3xl font-bold">Upgrade to Pro</h2>
              <StarIcon />
            </div>
            <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
              Transform your healthcare management with advanced analytics, AI insights, and enterprise-grade features
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">10x</div>
                <div className="text-purple-100">Faster Insights</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">99.9%</div>
                <div className="text-purple-100">Uptime SLA</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-2">24/7</div>
                <div className="text-purple-100">Expert Support</div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-50 font-semibold shadow-lg px-8">
                Start Pro Trial
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 font-semibold px-8">
                View Pricing
              </Button>
            </div>
            
            <p className="text-sm opacity-75 mt-6">
              14-day free trial • No credit card required • Cancel anytime
            </p>
          </CardContent>
        </Card>

        {/* Feature Preview */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Get a Preview of What&apos;s Coming</h3>
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-gray-200">
            <div className="w-full h-64 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
              <div className="text-center space-y-4">
                <ActivityIcon />
                <div>
                  <p className="text-lg font-semibold text-gray-900">Interactive Analytics Dashboard</p>
                  <p className="text-gray-600">Real-time charts, trends, and predictive insights</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
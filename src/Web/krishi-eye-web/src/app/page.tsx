"use client";

import { ArrowRight, Sprout, Tractor, FlaskConical, Truck, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/home/ItemCard";
import { TransporterCard } from "@/components/home/TransporterCard";
import { ServiceCard } from "@/components/home/ServiceCard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Hero Section - Clean & Impactful */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 py-12 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left z-10">
            <div className="inline-flex items-center rounded-full bg-green-50 px-4 py-1.5 text-sm font-medium text-green-700 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-green-600 mr-2 animate-pulse"></span>
              The #1 Marketplace for Agriculture
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-gray-900 mb-6 leading-[1.1]">
              Empowering <br /> <span className="text-primary">Agriculture</span>
            </h1>
            <p className="text-xl text-gray-500 max-w-xl mb-10 leading-relaxed mx-auto md:mx-0">
              One-stop solution for verified seeds, fertilizers, machinery, and expert services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="rounded-full px-8 h-14 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-base font-semibold border-gray-200 hover:bg-gray-50 text-gray-700">
                Find Services
              </Button>
            </div>
          </div>

          {/* Visual - Clean Gradient Blob */}
          <div className="flex-1 relative w-full max-w-lg aspect-square md:aspect-[4/3] bg-gradient-to-br from-green-50 to-emerald-50 rounded-[2rem] overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <Sprout className="h-48 w-48 text-green-600/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Clean Grid */}
      <section className="py-16 container mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-bold mb-8 text-center md:text-left text-gray-900">Browse by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Seeds", iconType: "Sprout", color: "text-emerald-600", bg: "bg-emerald-50" },
            { name: "Fertilizers", iconType: "FlaskConical", color: "text-blue-600", bg: "bg-blue-50" },
            { name: "Machinery", iconType: "Tractor", color: "text-orange-600", bg: "bg-orange-50" },
            { name: "Transport", iconType: "Truck", color: "text-indigo-600", bg: "bg-indigo-50" },
            { name: "Services", iconType: "ShieldCheck", color: "text-purple-600", bg: "bg-purple-50" },
            { name: "Others", iconType: "ArrowRight", color: "text-gray-600", bg: "bg-gray-50" },
          ].map((cat) => {
            const IconComponent = cat.iconType === "Sprout" ? Sprout :
              cat.iconType === "FlaskConical" ? FlaskConical :
                cat.iconType === "Tractor" ? Tractor :
                  cat.iconType === "Truck" ? Truck :
                    cat.iconType === "ShieldCheck" ? ShieldCheck :
                      ArrowRight;
            return (
              <Link href="#" key={cat.name} className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300">
                <div className={`h-14 w-14 rounded-full ${cat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                  <IconComponent className={`h-7 w-7 ${cat.color}`} />
                </div>
                <span className="font-medium text-gray-900">{cat.name}</span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Products - Gray Background for Contrast */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">Featured Products</h2>
              <p className="text-gray-500">Top quality picks for your farm.</p>
            </div>
            <Button variant="ghost" className="hidden md:flex gap-2 text-primary hover:bg-primary/5 font-medium">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            <ItemCard
              id={1}
              title="Premium Rice Seeds (BRRI-28)"
              price={765}
              regularPrice={850}
              unit="kg"
              sellerName="Green Valley Seeds"
              isVerified={true}
              rating={4.8}
              reviewCount={124}
              imageUrl="https://images.unsplash.com/photo-1586201375761-83865001e31c?q=80&w=600&auto=format&fit=crop"
              productType="Seeds"
              discountPercentage={10}
              transportIncluded={true}
            />
            <ItemCard
              id={2}
              title="Organic Fertilizer Mix"
              price={405}
              regularPrice={450}
              unit="bag"
              sellerName="Nature's Best"
              isVerified={true}
              rating={4.5}
              reviewCount={89}
              imageUrl="https://images.unsplash.com/photo-1628352081506-83c43123ed6d?q=80&w=600&auto=format&fit=crop"
              productType="Fertilizer"
              discountPercentage={10}
              transportIncluded={false}
            />
            <ItemCard
              id={3}
              title="Fresh Potatoes (Diamond)"
              price={25}
              regularPrice={0}
              unit="kg"
              sellerName="Bogura Farmers Co-op"
              isVerified={false}
              rating={4.2}
              reviewCount={56}
              imageUrl="https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=600&auto=format&fit=crop"
              productType="Vegetables"
              discountPercentage={0}
              transportIncluded={true}
            />
            <ItemCard
              id={4}
              title="Hybrid Corn Seeds"
              price={1080}
              regularPrice={1200}
              unit="pack"
              sellerName="AgroTech Solutions"
              isVerified={true}
              rating={4.9}
              reviewCount={210}
              imageUrl="https://images.unsplash.com/photo-1551754655-cd27e38d2076?q=80&w=600&auto=format&fit=crop"
              productType="Seeds"
              discountPercentage={10}
              transportIncluded={false}
            />
            <ItemCard
              id={5}
              title="Pesticide Sprayer"
              price={2500}
              regularPrice={3000}
              unit="Piece"
              sellerName="Farm Tools Co"
              isVerified={false}
              rating={4.2}
              reviewCount={45}
              imageUrl="https://images.unsplash.com/photo-1589923188900-85dae523342b?q=80&w=600&auto=format&fit=crop"
              productType="Equipment"
              discountPercentage={16}
              transportIncluded={false}
            />
          </div>

          <div className="mt-10 text-center md:hidden">
            <Button variant="outline" className="w-full rounded-full border-gray-200">View All Products</Button>
          </div>
        </div>
      </section>

      {/* Vehicle Type Section - White Background */}
      <section className="py-16 container mx-auto px-4 md:px-8">
        <h2 className="text-2xl font-bold mb-8 text-center md:text-left text-gray-900">Browse by Vehicle Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { name: "Trucks", count: "150+", color: "text-blue-600", bg: "bg-blue-50" },
            { name: "Pickup Vans", count: "220+", color: "text-green-600", bg: "bg-green-50" },
            { name: "Covered Vans", count: "180+", color: "text-purple-600", bg: "bg-purple-50" },
            { name: "Refrigerated", count: "45+", color: "text-cyan-600", bg: "bg-cyan-50" },
            { name: "Open Trucks", count: "120+", color: "text-orange-600", bg: "bg-orange-50" },
          ].map((vehicle) => (
            <Link href="#" key={vehicle.name} className="group flex flex-col items-center justify-center p-6 rounded-2xl bg-gray-50 hover:bg-white hover:shadow-lg transition-all duration-300">
              <div className={`h-12 w-12 rounded-full ${vehicle.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <Truck className={`h-6 w-6 ${vehicle.color}`} />
              </div>
              <span className="font-medium text-gray-900 mb-1">{vehicle.name}</span>
              <span className="text-xs text-gray-500">{vehicle.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Transporters Section - Gray Background */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">Verified Transporters</h2>
              <p className="text-gray-500">Reliable logistics partners.</p>
            </div>
            <Button variant="ghost" className="hidden md:flex gap-2 text-primary hover:bg-primary/5 font-medium">
              Find Transporters <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
            <TransporterCard
              id={1}
              name="FastTrack Logistics"
              vehicleCount={25}
              vehicleTypes={["Truck", "Covered Van", "Pickup Van"]}
              isVerified={true}
              rating={4.7}
              reviewCount={340}
              location="Dhaka, Bangladesh"
            />
            <TransporterCard
              id={2}
              name="Karim Transport"
              vehicleCount={3}
              vehicleTypes={["Truck"]}
              isVerified={true}
              rating={4.8}
              reviewCount={180}
              location="Cumilla, Bangladesh"
            />
            <TransporterCard
              id={3}
              name="Rural Connect"
              vehicleCount={8}
              vehicleTypes={["Pickup Van", "Open Truck"]}
              isVerified={true}
              rating={4.5}
              reviewCount={120}
              location="Rajshahi, Bangladesh"
            />
            <TransporterCard
              id={4}
              name="Express Movers Ltd"
              vehicleCount={42}
              vehicleTypes={["Truck", "Refrigerated", "Covered Van"]}
              isVerified={true}
              rating={4.9}
              reviewCount={520}
              location="Chattogram, Bangladesh"
            />
            <TransporterCard
              id={5}
              name="Sylhet Cargo"
              vehicleCount={15}
              vehicleTypes={["Covered Van", "Pickup Van"]}
              isVerified={true}
              rating={4.6}
              reviewCount={280}
              location="Sylhet, Bangladesh"
            />
          </div>
        </div>
      </section>

      {/* Consultants Section - White Background */}
      <section className="py-20 container mx-auto px-4 md:px-8">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-bold tracking-tight mb-2 text-gray-900">Expert Consultant</h2>
            <p className="text-gray-500">Veterinarians, testers, and consultants.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex gap-2 text-primary hover:bg-primary/5 font-medium">
            View All Consultants <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5 gap-6">
          <ServiceCard
            id={1}
            name="Dr. Rahim Uddin"
            serviceType="Veterinary"
            consultantType="Individual"
            isVerified={true}
            rating={4.9}
            reviewCount={560}
            experience="15+ Years"
          />
          <ServiceCard
            id={2}
            name="GreenLeaf Lab"
            serviceType="Crop Tester"
            consultantType="Agency"
            isVerified={true}
            rating={4.8}
            reviewCount={230}
            experience="Certified Lab"
          />
          <ServiceCard
            id={3}
            name="AgriConsult BD"
            serviceType="Consultant"
            consultantType="Agency"
            isVerified={true}
            rating={4.6}
            reviewCount={180}
            experience="10+ Years"
          />
          <ServiceCard
            id={4}
            name="Dr. Fatima Akter"
            serviceType="Veterinary"
            consultantType="Individual"
            isVerified={true}
            rating={4.7}
            reviewCount={320}
            experience="12+ Years"
          />
          <ServiceCard
            id={5}
            name="SoilCare Solutions"
            serviceType="Crop Tester"
            consultantType="Agency"
            isVerified={true}
            rating={4.5}
            reviewCount={195}
            experience="8+ Years"
          />
        </div>
      </section>

      {/* CTA Section - Clean Green */}
      <section className="py-24 bg-primary relative overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">Ready to Grow?</h2>
          <p className="text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the largest agricultural network in Bangladesh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="font-bold h-14 px-10 text-base shadow-xl hover:shadow-2xl transition-all rounded-full">
              Register Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

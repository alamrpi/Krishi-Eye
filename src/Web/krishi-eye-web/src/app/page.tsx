import { ArrowRight, Sprout, Tractor, FlaskConical, Truck, ShieldCheck, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ItemCard } from "@/components/home/ItemCard";
import { TransporterCard } from "@/components/home/TransporterCard";
import { ServiceCard } from "@/components/home/ServiceCard";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-muted/10">
      {/* Hero Section - Clean Banner Style */}
      <section className="relative bg-white overflow-hidden">
        <div className="container px-4 md:px-8 py-16 md:py-24 flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1 text-center md:text-left z-10">
            <div className="inline-flex items-center rounded-full border border-primary/20 px-4 py-1.5 text-sm font-medium text-primary bg-primary/5 mb-8">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              The #1 Marketplace for Agriculture
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.1]">
              Empowering <br /> <span className="text-primary">Agriculture</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
              One-stop solution for verified seeds, fertilizers, machinery, and expert services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button size="lg" className="rounded-full px-8 h-12 text-base font-semibold shadow-lg shadow-primary/20">
                Shop Now
              </Button>
              <Button size="lg" variant="outline" className="rounded-full px-8 h-12 text-base font-semibold border-primary/20 hover:bg-primary/5 text-primary">
                Find Services
              </Button>
            </div>
          </div>

          {/* Abstract Visual / Image Placeholder */}
          <div className="flex-1 relative w-full max-w-lg aspect-square md:aspect-[4/3] bg-gradient-to-br from-emerald-50 to-teal-50 rounded-3xl overflow-hidden shadow-sm border border-border/20">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-30"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Sprout className="h-48 w-48 text-primary/10" />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Bio-Xin Style Icons */}
      <section className="py-10 container px-4 md:px-8">
        <h2 className="text-xl font-bold mb-6 text-center md:text-left">Browse by Product Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {[
            { name: "Seeds", icon: Sprout, color: "text-emerald-600", bg: "bg-emerald-50" },
            { name: "Fertilizers", icon: FlaskConical, color: "text-blue-600", bg: "bg-blue-50" },
            { name: "Machinery", icon: Tractor, color: "text-orange-600", bg: "bg-orange-50" },
            { name: "Transport", icon: Truck, color: "text-indigo-600", bg: "bg-indigo-50" },
            { name: "Services", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
            { name: "Others", icon: ArrowRight, color: "text-gray-600", bg: "bg-gray-50" },
          ].map((cat) => (
            <Link href="#" key={cat.name} className="group flex flex-col items-center justify-center p-6 rounded-2xl border border-border/40 bg-white hover:border-primary/50 hover:shadow-md transition-all duration-300">
              <div className={`h-14 w-14 rounded-full ${cat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <cat.icon className={`h-7 w-7 ${cat.color}`} />
              </div>
              <span className="font-medium text-foreground group-hover:text-primary transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section - 2 Rows */}
      <section className="py-10 bg-white border-y border-border/40">
        <div className="container px-4 md:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">Featured Products</h2>
              <p className="text-sm text-muted-foreground">Top quality picks for your farm.</p>
            </div>
            <Button variant="ghost" className="hidden md:flex gap-2 text-primary hover:text-primary hover:bg-primary/5 font-medium text-sm">
              View All <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          {/* 2 Rows of Products */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ItemCard
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
              title="Fresh Potatoes (Diamond)"
              price={25}
              unit="kg"
              sellerName="Bogura Farmers Co-op"
              isVerified={false}
              rating={4.2}
              reviewCount={56}
              imageUrl="https://images.unsplash.com/photo-1518977676601-b53f82aba655?q=80&w=600&auto=format&fit=crop"
              productType="Vegetables"
              transportIncluded={true}
            />
            <ItemCard
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
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ItemCard
              title="NPK Fertilizer (20-20-20)"
              price={680}
              regularPrice={800}
              unit="bag"
              sellerName="FarmChem BD"
              isVerified={true}
              rating={4.7}
              reviewCount={156}
              imageUrl="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?q=80&w=600&auto=format&fit=crop"
              productType="Fertilizer"
              discountPercentage={15}
            />
            <ItemCard
              title="Garden Hand Tiller"
              price={1350}
              regularPrice={1500}
              unit="piece"
              sellerName="AgriTools Pro"
              isVerified={true}
              rating={4.6}
              reviewCount={89}
              imageUrl="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?q=80&w=600&auto=format&fit=crop"
              productType="Equipment"
              discountPercentage={10}
            />
            <ItemCard
              title="Tomato Seeds (Hybrid F1)"
              price={180}
              regularPrice={200}
              unit="pack"
              sellerName="Seed Master BD"
              isVerified={true}
              rating={4.8}
              reviewCount={267}
              imageUrl="https://images.unsplash.com/photo-1592924357229-2e0e9eefd593?q=80&w=600&auto=format&fit=crop"
              productType="Seeds"
              discountPercentage={10}
            />
            <ItemCard
              title="Pesticide Spray Pump"
              price={2250}
              unit="piece"
              sellerName="FarmSupply Ltd"
              isVerified={true}
              rating={4.5}
              reviewCount={134}
              imageUrl="https://images.unsplash.com/photo-1625246268800-c8c5e3f9a8b9?q=80&w=600&auto=format&fit=crop"
              productType="Equipment"
            />
          </div>

          <div className="mt-10 text-center md:hidden">
            <Button variant="outline" className="w-full rounded-full">View All Products</Button>
          </div>
        </div>
      </section>

      {/* Browse by Vehicle Type Section */}
      <section className="py-10 container px-4 md:px-8 bg-muted/30">
        <h2 className="text-xl font-bold mb-6 text-center md:text-left">Browse by Vehicle Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
          {[
            { name: "Trucks", icon: Truck, count: "150+", color: "text-blue-600", bg: "bg-blue-50" },
            { name: "Pickup Vans", icon: Truck, count: "220+", color: "text-green-600", bg: "bg-green-50" },
            { name: "Covered Vans", icon: Truck, count: "180+", color: "text-purple-600", bg: "bg-purple-50" },
            { name: "Refrigerated", icon: Truck, count: "45+", color: "text-cyan-600", bg: "bg-cyan-50" },
            { name: "Open Trucks", icon: Truck, count: "120+", color: "text-orange-600", bg: "bg-orange-50" },
          ].map((vehicle) => (
            <Link href="#" key={vehicle.name} className="group flex flex-col items-center justify-center p-4 rounded-xl border border-border/40 bg-white hover:border-primary/50 hover:shadow-md transition-all duration-300">
              <div className={`h-12 w-12 rounded-full ${vehicle.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <vehicle.icon className={`h-6 w-6 ${vehicle.color}`} />
              </div>
              <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors mb-1">{vehicle.name}</span>
              <span className="text-xs text-muted-foreground">{vehicle.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Transporters Section */}
      <section className="py-10 container px-4 md:px-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-1">Verified Transporters</h2>
            <p className="text-sm text-muted-foreground">Reliable logistics partners.</p>
          </div>
          <Button variant="ghost" className="hidden md:flex gap-2 text-primary hover:text-primary hover:bg-primary/5 font-medium text-sm">
            Find Transporters <ArrowRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <TransporterCard
            name="FastTrack Logistics"
            vehicleCount={25}
            vehicleTypes={["Truck", "Covered Van", "Pickup Van"]}
            isVerified={true}
            rating={4.7}
            reviewCount={340}
            location="Dhaka, Bangladesh"
          />
          <TransporterCard
            name="Karim Transport"
            vehicleCount={3}
            vehicleTypes={["Truck"]}
            isVerified={true}
            rating={4.8}
            reviewCount={180}
            location="Cumilla, Bangladesh"
          />
          <TransporterCard
            name="Rural Connect"
            vehicleCount={8}
            vehicleTypes={["Pickup Van", "Open Truck"]}
            isVerified={true}
            rating={4.5}
            reviewCount={120}
            location="Rajshahi, Bangladesh"
          />
          <TransporterCard
            name="Express Movers Ltd"
            vehicleCount={42}
            vehicleTypes={["Truck", "Refrigerated", "Covered Van"]}
            isVerified={true}
            rating={4.9}
            reviewCount={520}
            location="Chattogram, Bangladesh"
          />
        </div>

        {/* Second Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <TransporterCard
            name="Sylhet Cargo"
            vehicleCount={15}
            vehicleTypes={["Covered Van", "Pickup Van"]}
            isVerified={true}
            rating={4.6}
            reviewCount={280}
            location="Sylhet, Bangladesh"
          />
          <TransporterCard
            name="Rahim & Sons"
            vehicleCount={5}
            vehicleTypes={["Open Truck"]}
            isVerified={true}
            rating={4.4}
            reviewCount={95}
            location="Khulna, Bangladesh"
          />
          <TransporterCard
            name="Swift Logistics"
            vehicleCount={18}
            vehicleTypes={["Truck", "Refrigerated"]}
            isVerified={true}
            rating={4.8}
            reviewCount={410}
            location="Gazipur, Bangladesh"
          />
          <TransporterCard
            name="Green Transport"
            vehicleCount={12}
            vehicleTypes={["Pickup Van", "Covered Van"]}
            isVerified={false}
            rating={4.3}
            reviewCount={150}
            location="Barisal, Bangladesh"
          />
        </div>
      </section>

      {/* Browse by Consultant Type Section */}
      <section className="py-10 container px-4 md:px-8 bg-muted/30">
        <h2 className="text-xl font-bold mb-6 text-center md:text-left">Browse by Consultant Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { name: "Veterinary", icon: Stethoscope, count: "85+", color: "text-pink-600", bg: "bg-pink-50" },
            { name: "Crop Experts", icon: Sprout, count: "120+", color: "text-green-600", bg: "bg-green-50" },
            { name: "Soil Testing", icon: FlaskConical, count: "45+", color: "text-blue-600", bg: "bg-blue-50" },
            { name: "Pest Control", icon: ShieldCheck, count: "60+", color: "text-orange-600", bg: "bg-orange-50" },
          ].map((consultant) => (
            <Link href="#" key={consultant.name} className="group flex flex-col items-center justify-center p-4 rounded-xl border border-border/40 bg-white hover:border-primary/50 hover:shadow-md transition-all duration-300">
              <div className={`h-12 w-12 rounded-full ${consultant.bg} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                <consultant.icon className={`h-6 w-6 ${consultant.color}`} />
              </div>
              <span className="font-medium text-sm text-foreground group-hover:text-primary transition-colors mb-1">{consultant.name}</span>
              <span className="text-xs text-muted-foreground">{consultant.count}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Expert Consultant Section */}
      <section className="py-10 bg-white border-y border-border/40">
        <div className="container px-4 md:px-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight mb-1">Expert Consultant</h2>
              <p className="text-sm text-muted-foreground">Veterinarians, testers, and consultants.</p>
            </div>
            <Button variant="ghost" className="hidden md:flex gap-2 text-primary hover:text-primary hover:bg-primary/5 font-medium text-sm">
              View All Consultants <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <ServiceCard
              name="Dr. Rahim Uddin"
              serviceType="Veterinary"
              consultantType="Individual"
              isVerified={true}
              rating={4.9}
              reviewCount={560}
              experience="15+ Years"
            />
            <ServiceCard
              name="GreenLeaf Lab"
              serviceType="Crop Tester"
              consultantType="Agency"
              isVerified={true}
              rating={4.8}
              reviewCount={230}
              experience="Certified Lab"
            />
            <ServiceCard
              name="AgriConsult BD"
              serviceType="Consultant"
              consultantType="Agency"
              isVerified={true}
              rating={4.6}
              reviewCount={180}
              experience="10+ Years"
            />
            <ServiceCard
              name="Dr. Fatima Akter"
              serviceType="Veterinary"
              consultantType="Individual"
              isVerified={true}
              rating={4.7}
              reviewCount={320}
              experience="12+ Years"
            />
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <ServiceCard
              name="SoilCare Solutions"
              serviceType="Crop Tester"
              consultantType="Agency"
              isVerified={true}
              rating={4.5}
              reviewCount={195}
              experience="8+ Years"
            />
            <ServiceCard
              name="Dr. Hassan Ali"
              serviceType="Veterinary"
              consultantType="Individual"
              isVerified={true}
              rating={4.8}
              reviewCount={445}
              experience="18+ Years"
            />
            <ServiceCard
              name="Crop Health Advisors"
              serviceType="Consultant"
              consultantType="Agency"
              isVerified={true}
              rating={4.7}
              reviewCount={310}
              experience="12+ Years"
            />
            <ServiceCard
              name="Dr. Shahnaz Begum"
              serviceType="Veterinary"
              consultantType="Individual"
              isVerified={false}
              rating={4.4}
              reviewCount={180}
              experience="10+ Years"
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-10"></div>
        <div className="container px-4 md:px-8 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">Ready to Grow?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto mb-10 leading-relaxed">
            Join the largest agricultural network in Bangladesh.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="font-bold h-12 px-10 text-base shadow-lg hover:shadow-xl transition-all">
              Register Now
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

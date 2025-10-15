import { ArrowRight, Shield, Sparkles, FileText, CheckCircle2, Leaf, Brain, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 animated-gradient opacity-10" />
        
        <div className="container relative mx-auto px-4 py-20 md:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm font-medium text-primary animate-fade-in">
              <Sparkles className="h-4 w-4" />
              Health • Wisdom • Virtue
            </div>
            
            <h1 className="mb-6 text-5xl font-bold tracking-tight md:text-7xl animate-fade-in">
              Product Transparency
              <span className="gradient-text block">Made Simple</span>
            </h1>
            
            <p className="mb-8 text-xl text-muted-foreground md:text-2xl animate-fade-in">
              Make informed, ethical decisions with AI-powered product analysis.
              Built on principles of health, wisdom, and virtue.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row animate-fade-in">
              <Link to="/login">
                <Button size="lg" className="group gap-2 shadow-lg hover:shadow-xl transition-all">
                  Submit a Product
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2">
                How It Works
              </Button>
            </div>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="container relative mx-auto px-4 pb-20">
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
            <div className="glass rounded-2xl p-6 text-center transition-all hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Leaf className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 font-semibold">Health First</h3>
              <p className="text-sm text-muted-foreground">
                Products analyzed for health impact and wellbeing
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center transition-all hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
                <Brain className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-2 font-semibold">Wisdom Driven</h3>
              <p className="text-sm text-muted-foreground">
                AI-powered insights based on comprehensive data
              </p>
            </div>

            <div className="glass rounded-2xl p-6 text-center transition-all hover:shadow-lg">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                <Heart className="h-6 w-6 text-accent" />
              </div>
              <h3 className="mb-2 font-semibold">Ethical Standards</h3>
              <p className="text-sm text-muted-foreground">
                Transparency reports built on virtue and integrity
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-muted/30 py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Why Product Transparency Matters
            </h2>
            <p className="text-lg text-muted-foreground">
              Every product choice impacts your health, the environment, and society.
              Make decisions that align with your values.
            </p>
          </div>

          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <FeatureCard
              icon={Shield}
              title="Complete Transparency"
              description="Get full disclosure on ingredients, sourcing, manufacturing processes, and ethical practices."
            />
            <FeatureCard
              icon={Sparkles}
              title="AI-Powered Analysis"
              description="Our intelligent system generates custom questions to uncover hidden details about each product."
            />
            <FeatureCard
              icon={FileText}
              title="Detailed Reports"
              description="Receive comprehensive transparency reports you can download, share, and reference anytime."
            />
            <FeatureCard
              icon={CheckCircle2}
              title="Trust Verification"
              description="Multi-layered verification ensures information accuracy and builds consumer trust."
            />
            <FeatureCard
              icon={Leaf}
              title="Health Impact"
              description="Understand how products affect your wellbeing and make health-conscious choices."
            />
            <FeatureCard
              icon={Heart}
              title="Ethical Sourcing"
              description="Learn about labor practices, environmental impact, and social responsibility."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              How It Works
            </h2>
            <p className="text-lg text-muted-foreground">
              Three simple steps to complete product transparency
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="relative">
              {/* Connection line */}
              <div className="absolute left-8 top-16 bottom-16 w-0.5 bg-border hidden md:block" />

              <div className="space-y-12">
                <Step
                  number={1}
                  title="Submit Product Details"
                  description="Start by providing basic information about your product. Our intuitive form makes it easy."
                />
                <Step
                  number={2}
                  title="Answer Smart Questions"
                  description="Our AI generates intelligent follow-up questions based on your responses, ensuring no detail is missed."
                />
                <Step
                  number={3}
                  title="Get Your Report"
                  description="Receive a comprehensive transparency report that builds trust with consumers and stakeholders."
                />
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <Link to="/submit">
              <Button size="lg" className="gap-2">
                Get Started Now
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="glass mx-auto max-w-3xl rounded-3xl p-8 text-center md:p-12">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">
              Ready to Build Trust Through Transparency?
            </h2>
            <p className="mb-8 text-lg text-muted-foreground">
              Join forward-thinking companies committed to ethical practices and consumer trust.
            </p>
            <Link to="/submit">
              <Button size="lg" className="gap-2 shadow-lg">
                Submit Your Product
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
}

const FeatureCard = ({ icon: Icon, title, description }: FeatureCardProps) => {
  return (
    <div className="group glass rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

interface StepProps {
  number: number;
  title: string;
  description: string;
}

const Step = ({ number, title, description }: StepProps) => {
  return (
    <div className="relative flex gap-6">
      <div className="relative z-10 flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-primary text-2xl font-bold text-primary-foreground shadow-lg">
        {number}
      </div>
      <div className="flex-1 pt-3">
        <h3 className="mb-2 text-xl font-semibold">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default Index;

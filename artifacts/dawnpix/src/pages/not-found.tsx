import { Link } from "wouter";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Layout>
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center bg-white/80 backdrop-blur-md p-12 rounded-3xl border-2 border-white shadow-xl max-w-md w-full">
          <h1 className="text-6xl font-display font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-bold text-foreground mb-2">Lost your picture?</h2>
          <p className="text-muted-foreground mb-8">
            We couldn't find the page you're looking for. It might have floated away with the sparkles.
          </p>
          <Link href="/">
            <Button size="lg" className="w-full">Back to Home</Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}

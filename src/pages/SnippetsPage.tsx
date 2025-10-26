import React from "react";
import { AnimatedBook } from "../components";

const SnippetsPage: React.FC = () => {
  return (
    <main className="relative min-h-screen flex flex-col bg-black text-white">
      <section className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* radial red glow behind the book */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(circle at 50% 40%, rgba(80,0,0,0.6) 0%, rgba(0,0,0,0.95) 70%)",
          }}
        />
        <AnimatedBook />
      </section>
    </main>
  );
};

export default SnippetsPage;

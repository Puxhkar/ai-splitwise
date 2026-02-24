import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LayoutDashboard, Info, Receipt, MessageCircle, ArrowRight, UserCircle, MapPin, Phone, Mail } from "lucide-react";
import { TESTIMONIALS } from "@/lib/landing";
import { LandingChatWidget } from "@/components/landing-chat-widget";

export default function LandingPage() {
  return (
    <div className="flex flex-col pt-16 font-sans bg-white pb-24">
      {/* ───── Hero ───── */}
      <section className="mt-8 pb-12 px-2 md:px-5">
        <div className="container mx-auto max-w-6xl">
          <div className="relative w-full bg-zinc-950 rounded-[3rem] pt-16 md:pt-24 px-6 md:px-10 pb-0 overflow-hidden group shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] flex flex-col items-center text-center">

            {/* Animated Background gradients */}
            <div className="absolute inset-0 bg-gradient-to-tr from-green-500/20 via-blue-600/10 to-transparent blur-3xl opacity-50 group-hover:opacity-80 transition duration-700"></div>

            {/* Text Content */}
            <div className="relative z-20 space-y-6 max-w-4xl flex flex-col items-center">
              <Badge variant="outline" className="bg-white/10 border-white/20 text-white rounded-full px-4 py-1.5 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
                The Ultimate Splitting Engine
              </Badge>

              <h1 className="text-white text-6xl md:text-8xl lg:text-[6.5rem] font-black tracking-tighter leading-[1.05]">
                Split expenses.<br />Keep the friendship.
              </h1>

              <p className="max-w-[600px] text-zinc-300 md:text-xl font-medium mt-6">
                The smartest, cleanest way to track shared expenses, split bills effortlessly, and settle up in a snap. Say goodbye to the math.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <div className="relative group flex flex-col items-center">
                  <div className="absolute -top-16 bg-zinc-900 text-white font-bold px-4 py-2 rounded-xl shadow-2xl border border-zinc-700 text-sm whitespace-nowrap animate-bounce z-50 pointer-events-none flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[10px]">✨</span>
                    Start your App Tour here!
                    <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-l-transparent border-t-[8px] border-t-zinc-900 border-r-[6px] border-r-transparent"></div>
                  </div>

                  <Button
                    id="tour-go-to-dashboard-main"
                    asChild
                    size="lg"
                    className="bg-white text-zinc-950 hover:bg-zinc-200 rounded-full px-12 py-8 text-2xl font-black shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-transform hover:scale-105"
                  >
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-3 h-6 w-6 text-blue-600" />
                      Go to Dashboard
                    </Link>
                  </Button>
                </div>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-white/20 text-white bg-white/5 hover:bg-white/10 rounded-full px-8 py-6 text-lg font-bold shadow-sm backdrop-blur-md transition-transform hover:scale-105"
                >
                  <Link href="/how-it-works">
                    <Info className="mr-2 h-5 w-5" />
                    How It Works
                  </Link>
                </Button>
              </div>
            </div>

            {/* Cartoonish Avatar Banner Layered bottom center */}
            <div className="relative w-full h-[200px] md:h-[300px] mt-12 flex justify-center items-end z-10 transition duration-500 group-hover:-translate-y-4">
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Jessica&backgroundColor=transparent" alt="Avatar" className="h-[180%] md:h-[200%] absolute -bottom-10 md:-bottom-20 -translate-x-24 md:-translate-x-48 opacity-90 drop-shadow-2xl transition duration-500 hover:rotate-3 hover:scale-105 z-20 hover:z-50" />
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Sam&backgroundColor=transparent" alt="Avatar" className="h-[200%] md:h-[220%] absolute -bottom-10 md:-bottom-20 z-10 drop-shadow-2xl transition duration-500 hover:-rotate-3 hover:scale-105 hover:z-50" />
              <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Milo&backgroundColor=transparent&flip=true" alt="Avatar" className="h-[180%] md:h-[200%] absolute -bottom-10 md:-bottom-20 translate-x-24 md:translate-x-48 opacity-90 drop-shadow-2xl transition duration-500 hover:rotate-[4deg] hover:scale-105 z-20 hover:z-50" />
            </div>

          </div>
        </div>
      </section>

      {/* ───── Live Dashboard Chat on Home Page ───── */}
      <LandingChatWidget />

      {/* ───── Main Feature Mockup ───── */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-zinc-50/50 border border-zinc-100 rounded-[2rem] p-8 md:p-12 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.05)] flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2 space-y-6">
              <div className="flex gap-2 mb-8">
                <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
                <div className="w-2 h-2 rounded-full bg-zinc-300"></div>
              </div>
              <div className="text-xs font-bold tracking-widest text-zinc-400 uppercase">Splitr Expense</div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900">Main Feature: Split Instantly</h2>
              <p className="text-zinc-500 text-sm leading-relaxed max-w-sm">
                Equally, by percentage, or exact amounts. Select your flatmates or travel buddies, enter an amount, and our engine splits it mathematically perfectly.
              </p>

              <div className="mt-8 bg-white border border-zinc-100 rounded-2xl p-4 flex items-center shadow-sm">
                <div className="bg-black text-white p-3 rounded-xl mr-4"><Receipt className="h-5 w-5" /></div>
                <div>
                  <div className="font-bold text-zinc-900 text-sm">Dinner at Nobu</div>
                  <div className="text-zinc-500 text-xs">Total: ₹240.00</div>
                </div>
                <div className="ml-auto bg-green-50 text-green-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">Split equally</div>
              </div>
            </div>

            <div className="md:w-1/2 w-full space-y-3">
              <div className="bg-[#1C2331] text-white rounded-xl p-4 flex items-center justify-between shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium">Y</div>
                  <span className="font-semibold text-sm">You</span>
                </div>
                <span className="font-bold text-sm">₹80.00</span>
              </div>
              <div className="bg-white border border-zinc-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-100 text-zinc-600 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium">S</div>
                  <span className="font-semibold text-sm text-zinc-900">Sarah</span>
                </div>
                <span className="font-bold text-sm text-zinc-900">₹80.00</span>
              </div>
              <div className="bg-white border border-zinc-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-100 text-zinc-600 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium">M</div>
                  <span className="font-semibold text-sm text-zinc-900">Mike</span>
                </div>
                <span className="font-bold text-sm text-zinc-900">₹80.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───── Live Chat Feature Mockup ───── */}
      <section className="py-16 bg-zinc-50/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row-reverse items-center gap-16">

            <div className="md:w-1/2 space-y-6">
              <Badge variant="outline" className="bg-white border-zinc-200 text-zinc-600 rounded-full px-3 py-1 shadow-sm text-xs font-medium">
                New Feature
              </Badge>
              <h2 className="text-4xl font-bold tracking-tight text-zinc-900">Live Group Chat</h2>
              <p className="text-zinc-500 text-sm leading-relaxed pb-4">
                Splitting expenses isn't just about math; it's about the journey. Create a group for your trip, share thoughts, upload receipts, and chat live with your friends while seamlessly tracking who owes what.
              </p>

              <ul className="space-y-4 text-sm font-medium text-zinc-700">
                <li className="flex items-center gap-3">
                  <div className="bg-black text-white p-1 rounded-full"><MessageCircle className="w-3 h-3" /></div>
                  Real-time instant messaging
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-black text-white p-1 rounded-full"><MessageCircle className="w-3 h-3" /></div>
                  Automated expense notifications inside chat
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-black text-white p-1 rounded-full"><MessageCircle className="w-3 h-3" /></div>
                  Discuss settlements directly
                </li>
              </ul>
            </div>

            {/* Chat Image element replacing standard photo */}
            <div className="md:w-1/2 w-full relative group bg-indigo-50/50 border border-indigo-100 rounded-[3rem] p-10 h-[450px] flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-blue-200 blur-3xl opacity-20 transition duration-500 group-hover:scale-110"></div>

              {/* Cartoon Illustration Characters */}
              <div className="relative z-10 flex gap-2 md:gap-4 transition-transform duration-700 ease-in-out group-hover:scale-105">
                <div className="relative -rotate-[10deg] transform hover:rotate-0 transition duration-300">
                  <div className="absolute -top-12 -right-10 md:-right-8 w-max bg-white rounded-3xl rounded-br-none px-4 py-2 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.1)] text-xs font-bold text-zinc-800 z-20">We split the pizza? 🍕</div>
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Milo&backgroundColor=c0aede" alt="Avatar chatting" className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[6px] border-white shadow-xl" />
                </div>
                <div className="relative mt-24 rotate-[8deg] transform hover:rotate-0 transition duration-300">
                  <div className="absolute -top-12 -left-10 md:-left-8 w-max bg-[#1C2331] rounded-3xl rounded-bl-none px-4 py-2 shadow-[0_10px_20px_-5px_rgba(0,0,0,0.3)] text-xs font-bold text-white z-20">Yeah, ₹20 each! 💸</div>
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=b6e3f4" alt="Avatar replying" className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[6px] border-white shadow-xl" />
                </div>
              </div>

              {/* Float Widget Layer */}
              <div className="absolute bottom-6 left-6 bg-white p-4 rounded-3xl shadow-xl flex items-center gap-4 transition duration-500 group-hover:-translate-y-2 z-20">
                <div className="bg-green-100 p-3 rounded-full"><MessageCircle className="w-6 h-6 text-green-700" /></div>
                <div>
                  <p className="font-bold text-sm text-zinc-900">Active Group Chat</p>
                  <p className="text-xs text-zinc-500 font-medium">Group is chatting...</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ───── Avatars Feature Mockup ───── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto bg-zinc-950 rounded-[3rem] p-10 md:p-16 shadow-2xl flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">

            {/* Background design elements */}
            <div className="absolute top-0 right-0 p-8 opacity-10 blur-[80px] bg-white w-96 h-96 rounded-full pointer-events-none"></div>

            <div className="md:w-1/2 w-full relative z-10 space-y-4">
              <div className="grid grid-cols-3 gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-3xl shadow-xl">
                {[
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix",
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka",
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Milo",
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jessica",
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Sam",
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Jocelyn"
                ].map((src, i) => (
                  <div key={i} className={`rounded-xl p-2 flex items-center justify-center transition-all ${i === 2 ? 'bg-zinc-800 border-2 border-zinc-700 scale-105' : 'bg-zinc-950 border border-zinc-800/50 grayscale hover:grayscale-0'}`}>
                    <img src={src} className="w-16 h-16 rounded-full bg-zinc-800" />
                  </div>
                ))}
                <div className="col-span-3 mt-4">
                  <Button className="w-full bg-white text-zinc-950 hover:bg-zinc-200 text-sm font-bold uppercase tracking-widest h-12 rounded-xl">
                    Save Profile
                  </Button>
                </div>
              </div>
            </div>

            <div className="md:w-1/2 space-y-6 relative z-10 text-white">
              <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-300 rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest">
                Personalization
              </Badge>
              <h2 className="text-4xl font-black tracking-tight text-white leading-tight">
                Express yourself with <br /> custom avatars.
              </h2>
              <p className="text-zinc-400 text-sm leading-relaxed pb-4 font-medium">
                Make your profile distinctly yours. Choose from our curated collection of built-in character avatars to represent you in group chats and expense histories. Because getting paid back should be fun.
              </p>

              <ul className="space-y-4 text-sm font-medium text-zinc-300">
                <li className="flex items-center gap-3">
                  <div className="bg-zinc-800 text-white p-1.5 rounded-full"><UserCircle className="w-4 h-4" /></div>
                  Instant character assignment
                </li>
                <li className="flex items-center gap-3">
                  <div className="bg-zinc-800 text-white p-1.5 rounded-full"><UserCircle className="w-4 h-4" /></div>
                  Synchronized across all groups
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* ───── Testimonials ───── */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <Badge variant="outline" className="bg-zinc-50 border-zinc-200 text-zinc-600 rounded-full px-4 py-1.5 shadow-sm text-xs font-semibold mb-6">
            Testimonials
          </Badge>
          <h2 className="text-4xl font-bold tracking-tight text-zinc-900 mb-16">
            Loved by humans
          </h2>

          <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {TESTIMONIALS.map(({ quote, name, role, image }) => (
              <Card key={name} className="flex flex-col justify-between border-zinc-100 shadow-sm rounded-3xl bg-white text-center p-8">
                <CardContent className="space-y-6 p-0 flex flex-col items-center h-full justify-between">
                  <p className="text-zinc-600 text-sm leading-relaxed font-medium pb-4">"{quote}"</p>
                  <div className="flex flex-col items-center space-y-4 pt-6 border-t border-zinc-100 w-full">
                    <Avatar className="h-20 w-20 border-4 border-white shadow-md bg-zinc-50">
                      <AvatarImage src={image} alt={name} className="object-cover" />
                      <AvatarFallback className="bg-zinc-100 text-zinc-600 font-black text-xl">
                        {name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-base font-bold text-zinc-900">{name}</p>
                      <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">{role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ───── Footer ───── */}
      <footer className="bg-zinc-50 border-t border-zinc-200 pt-20 pb-10 mt-12 w-full">
        <div className="container mx-auto px-4 max-w-5xl flex flex-col items-center">

          <div className="inline-flex items-center justify-center bg-zinc-200 text-zinc-900 rounded-full px-4 py-1.5 text-xs font-bold uppercase tracking-widest mb-4">
            Contact & Support
          </div>

          <h3 className="text-4xl md:text-5xl font-black text-zinc-900 tracking-tight text-center">Need help? We're here.</h3>
          <p className="text-zinc-500 font-medium leading-relaxed pb-8 text-center max-w-2xl mt-4 text-base md:text-lg">
            Our support team consists of real humans who are available to solve any app issues, answer your questions, or just chat about how Splitr can make your life easier! No robotic queues.
          </p>

          {/* Detailed Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-12 text-left w-full mt-2">
            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col items-start hover:shadow-md hover:border-zinc-300 transition-all">
              <MapPin className="h-6 w-6 text-zinc-400 mb-4" />
              <h4 className="font-bold text-zinc-900 text-lg pb-1">Headquarters</h4>
              <p className="text-zinc-600 font-medium text-sm pt-2">123 Tech Avenue</p>
              <p className="text-zinc-500 text-xs mt-0.5">San Francisco, CA 94105</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col items-start hover:shadow-md hover:border-zinc-300 transition-all">
              <Phone className="h-6 w-6 text-zinc-400 mb-4" />
              <h4 className="font-bold text-zinc-900 text-lg pb-1">Phone Support</h4>
              <a href="tel:9519956111" className="text-zinc-600 font-medium text-sm pt-2 hover:underline hover:text-green-600 transition">9519956111</a>
              <p className="text-zinc-500 text-xs mt-0.5">Mon-Sat, 9am - 6pm EST</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-zinc-200 shadow-sm flex flex-col items-start hover:shadow-md hover:border-zinc-300 transition-all">
              <Mail className="h-6 w-6 text-zinc-400 mb-4" />
              <h4 className="font-bold text-zinc-900 text-lg pb-1">Email Connect</h4>
              <a href="mailto:guptapushkar276@gmail.com" className="text-zinc-600 font-medium text-sm pt-2 hover:underline hover:text-green-600 transition truncate w-full">guptapushkar276@gmail.com</a>
              <p className="text-zinc-500 text-xs mt-0.5">Typical reply under 2 hrs</p>
            </div>
          </div>

          <div className="pt-10 border-t border-zinc-200 flex flex-col items-center gap-2 w-full justify-center text-center">
            <h2 className="font-black text-3xl tracking-tighter text-zinc-900">splitr</h2>
            <p className="text-zinc-400 text-xs font-black uppercase tracking-widest pt-2">made by Pushkar gupta</p>
          </div>

        </div>
      </footer>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Heart, BookOpen, Building2, Lightbulb, ArrowRight, Clock } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import SEOHead from '../components/SEOHead';
import Button from '../components/Button';
import EventCard from '../components/EventCard';
import EventDetailsModal from '../components/EventDetailsModal';
import NewsCard from '../components/NewsCard';
import TestimonialCard from '../components/TestimonialCard';
import StatsSection from '../components/StatsSection';
import CountdownTimer from '../components/CountdownTimer';
import LoadingSpinner from '../components/LoadingSpinner';
import { cmsApi } from '../lib/cmsApi';
import { CMSEvent, CMSNewsArticle, CMSTestimonial, Event } from '../types';

// 🔹 Helper to strip HTML tags
const stripHtml = (html: string): string =>
  html.replace(/<[^>]+>/g, '').trim();

const HomePage: React.FC = () => {
  const [events, setEvents] = useState<CMSEvent[]>([]);
  const [news, setNews] = useState<CMSNewsArticle[]>([]);
  const [testimonials, setTestimonials] = useState<CMSTestimonial[]>([]);
  const [latestSnippet, setLatestSnippet] = useState<CMSNewsArticle | null>(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const loadHomePageData = async () => {
      try {
        setDataLoading(true);
        setError(null);

        const results = await Promise.allSettled([
          cmsApi.getEvents(),
          cmsApi.getNewsArticles(),
          cmsApi.getTestimonials(),
          cmsApi.getLatestSnippet()
        ]);

        const eventsData = results[0].status === 'fulfilled' ? results[0].value : [];
        const newsData = results[1].status === 'fulfilled' ? results[1].value : [];
        const testimonialsData = results[2].status === 'fulfilled' ? results[2].value : [];
        const latestSnippetData = results[3].status === 'fulfilled' ? results[3].value : null;

        const now = new Date();
        const upcomingEvents = eventsData
          .filter(event => new Date(event.event_date) > now && !event.is_past_event)
          .sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
          .slice(0, 3);

        const publishedNews = newsData
          .filter(article => article.is_published)
          .map(article => ({
            ...article,
            summary: stripHtml(article.summary || article.content || '')
          }))
          .sort((a, b) => new Date(b.publish_date).getTime() - new Date(a.publish_date).getTime())
          .slice(0, 3);

        const publishedTestimonials = testimonialsData
          .filter(testimonial => testimonial.is_published)
          .sort((a, b) => a.sort_order - b.sort_order);

        setEvents(upcomingEvents);
        setNews(publishedNews);
        setTestimonials(publishedTestimonials);
        setLatestSnippet(latestSnippetData);

      } catch (err) {
        console.error('Error loading homepage data:', err);
        setError('Failed to load content. Please try again later.');
        setEvents([]);
        setNews([]);
        setTestimonials([]);
        setLatestSnippet(null);
      } finally {
        setDataLoading(false);
      }
    };

    loadHomePageData();
  }, []);

  const convertEventData = (cmsEvent: CMSEvent) => ({
    id: cmsEvent.id,
    title: cmsEvent.title,
    date: new Date(cmsEvent.event_date),
    description: cmsEvent.description,
    location: cmsEvent.location,
    isMembers: cmsEvent.is_members_only
  });

  const convertNewsData = (cmsNews: CMSNewsArticle) => ({
    id: cmsNews.id,
    title: cmsNews.title,
    date: new Date(cmsNews.publish_date),
    summary: stripHtml(cmsNews.summary || cmsNews.content || ''),
    content: cmsNews.content,
    image: cmsNews.image_url,
    isMembers: cmsNews.is_members_only
  });

  const convertTestimonialData = (cmsTestimonial: CMSTestimonial) => ({
    id: cmsTestimonial.id,
    name: cmsTestimonial.member_name,
    content: cmsTestimonial.content,
    image: cmsTestimonial.image_url
  });

  const handleViewDetails = (event: Event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  return (
    <>
      <SEOHead
        title="Radlett Lodge No. 6652 - Freemasons | Brotherhood, Charity & Tradition"
        description="Welcome to Radlett Lodge No. 6652, a Masonic Lodge in Hertfordshire under the United Grand Lodge of England."
        keywords="Radlett Lodge 6652, Freemasonry, Hertfordshire, United Grand Lodge England, Masonic Lodge, Brotherhood, Charity, Tradition, Join Freemasons"
      />

      {/* Hero Section */}
      <section
        className="relative min-h-screen flex items-center justify-center text-white overflow-hidden"
        style={{
          backgroundImage: `url('/masonic-pillars.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'bottom center',
        }}
      >
        <div className="absolute inset-0 bg-primary-900 opacity-30"></div>
        <div className="container mx-auto px-4 relative z-10 text-center max-w-5xl">
          <div className="mb-2 mt-24 animate-fadeIn" style={{ animationDelay: '0.3s' }}>
            <img
              src="/LODGE PIC copy copy.png"
              alt="Radlett Lodge No. 6652 Logo"
              className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 mx-auto object-contain drop-shadow-2xl"
              onError={(e) => { e.currentTarget.style.display = 'none'; }}
            />
            <div className="w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 xl:w-96 xl:h-96 mx-auto bg-secondary-500 rounded-full items-center justify-center hidden drop-shadow-2xl">
              <Building2 className="w-24 h-24 md:w-32 lg:w-40 xl:w-48 text-primary-600" />
            </div>
          </div>
          <div className="animate-fadeIn mt-4" style={{ animationDelay: '0.5s' }}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-heading font-bold mb-6 leading-tight text-secondary-500 text-chiselled">
              Radlett Lodge No. 6652
            </h1>
            <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-white">
              Integrity, Friendship, Respect and Service
            </p>
            <p className="text-lg md:text-xl mb-10 text-secondary-100">
              A Masonic Lodge Under the jurisdiction of United Grand Lodge of England
            </p>
          </div>
          <div className="animate-fadeIn flex flex-col sm:flex-row justify-center gap-4 mb-10" style={{ animationDelay: '0.6s' }}>
            <Link to="/about">
              <Button variant="primary" size="lg" className="min-w-[200px]">Learn About Us</Button>
            </Link>
            <Link to="/join">
              <Button variant="outline" size="lg" className="min-w-[200px] border-white text-white hover:bg-white hover:text-primary-600">
                Join Our Lodge
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-heading font-bold text-primary-600 mb-6">Welcome to Our Lodge</h2>
              <p className="text-lg mb-6 text-neutral-600">Founded in 1948, Radlett Lodge No. 6652 is a vibrant Masonic Lodge operating under the United Grand Lodge of England within the Province of Hertfordshire.</p>
              <p className="text-lg mb-6 text-neutral-600">Our Lodge is committed to fostering personal development, ethical conduct, and charitable endeavors among our members while maintaining the rich traditions of Freemasonry.</p>
              <div className="mt-8">
                <Link to="/about"><Button variant="primary">Discover Our History</Button></Link>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/2928232/pexels-photo-2928232.jpeg"
                alt="Masonic Temple Interior"
                className="rounded-lg shadow-medium w-full h-auto object-cover"
                loading="lazy"
              />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-secondary-500 rounded-lg flex items-center justify-center">
                <BookOpen className="w-12 h-12 text-primary-800" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-neutral-50">
        <div className="container mx-auto px-4 md:px-6">
          <SectionHeading title="Our Core Values" subtitle="Freemasonry is founded on the principles of Brotherly Love, Relief, and Truth." centered />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
            <div className="bg-white rounded-lg p-6 shadow-soft text-center">
              <div className="inline-flex p-3 bg-primary-100 text-primary-600 rounded-full mb-4"><Users size={24} /></div>
              <h3 className="text-xl font-heading font-semibold text-primary-600 mb-3">Integrity</h3>
              <p className="text-neutral-600">Honesty, trust, honour, reliability, and conscience are the pillars of good character.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-soft text-center">
              <div className="inline-flex p-3 bg-primary-100 text-primary-600 rounded-full mb-4"><Heart size={24} /></div>
              <h3 className="text-xl font-heading font-semibold text-primary-600 mb-3">Friendship</h3>
              <p className="text-neutral-600">Freemasonry offers lifelong friendships with like-minded individuals.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-soft text-center">
              <div className="inline-flex p-3 bg-primary-100 text-primary-600 rounded-full mb-4"><BookOpen size={24} /></div>
              <h3 className="text-xl font-heading font-semibold text-primary-600 mb-3">Respect</h3>
              <p className="text-neutral-600">We respect the beliefs, opinions, and dignity of all people.</p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-soft text-center">
              <div className="inline-flex p-3 bg-primary-100 text-primary-600 rounded-full mb-4"><Heart size={24} /></div>
              <h3 className="text-xl font-heading font-semibold text-primary-600 mb-3">Service</h3>
              <p className="text-neutral-600">Through charitable work and community service, we strive to make a positive difference.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Snippet */}
      {latestSnippet && (
        <section className="py-16 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl p-8 shadow-lg border">
              <h2 className="text-2xl md:text-3xl font-heading font-bold text-primary-600 mb-4 text-center">Weekly Snippet</h2>
              <h3 className="text-xl font-semibold text-primary-600 mb-4">{latestSnippet.title}</h3>
              <div className="prose prose-lg max-w-none text-neutral-700 mb-6" dangerouslySetInnerHTML={{ __html: latestSnippet.content }} />
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-neutral-500"><Clock size={16} className="mr-2" /><span>{new Date(latestSnippet.publish_date).toLocaleDateString('en-GB')}</span></div>
                <Link to="/snippets"><Button variant="outline" size="sm" className="flex items-center">Read More Snippets<ArrowRight size={16} className="ml-2" /></Button></Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <StatsSection />

      {/* Countdown */}
      <CountdownTimer useSchedule={true} />

      {/* Events */}
      {!dataLoading && events.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeading title="Upcoming Events" subtitle="Join us for our upcoming Lodge meetings and social events." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {events.map(event => (
                <EventCard key={event.id} event={convertEventData(event)} onViewDetails={handleViewDetails} />
              ))}
            </div>
            <div className="text-center mt-12"><Link to="/events"><Button variant="outline">View All Events</Button></Link></div>
          </div>
        </section>
      )}

      {/* News */}
      {!dataLoading && news.length > 0 && (
        <section className="py-20 bg-neutral-50">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeading title="Latest News" subtitle="Stay updated with the latest happenings at Radlett Lodge." />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {news.map(newsItem => (<NewsCard key={newsItem.id} news={convertNewsData(newsItem)} />))}
            </div>
            <div className="text-center mt-12"><Link to="/news"><Button variant="outline">Read All News</Button></Link></div>
          </div>
        </section>
      )}

      {/* Testimonials */}
      {!dataLoading && testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <SectionHeading title="What Our Members Say" subtitle="Hear from our Lodge members about their Masonic journey." centered />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
              {testimonials.slice(0, 3).map(testimonial => (<TestimonialCard key={testimonial.id} testimonial={convertTestimonialData(testimonial)} />))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-6">Ready to Begin Your Masonic Journey?</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-neutral-100">Discover the timeless values of Freemasonry and join a brotherhood dedicated to personal growth, community service, and lifelong friendship.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link to="/join"><Button variant="primary" size="lg">Learn How to Join</Button></Link>
            <Link to="/contact"><Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-primary-600">Contact Our Secretary</Button></Link>
          </div>
        </div>
      </section>

      {/* Event Modal */}
      <EventDetailsModal isOpen={showModal} onClose={handleCloseModal} event={selectedEvent} />
    </>
  );
};

export default HomePage;

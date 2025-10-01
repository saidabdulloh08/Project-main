'use client';

import { useAppContext } from '@/lib/context';
import { AboutItem } from '@/lib/types';
import './About.css';

export default function AboutSection() {
    const { getContent } = useAppContext();
    const aboutContent = getContent().about;
    const items: AboutItem[] = aboutContent.items || [];

    return (
        <section id="biz-haqimizda" className="section-container">
            <div className="section-content">
                <h2 className="section-heading">{aboutContent.heading}</h2>
                <p className="section-description">{aboutContent.text}</p>

                <div className="about-grid">
                    {items.map((item, index) => (
                        <div key={index} className="parent">
                            <div className="card about-card"> {/* faqat About Us uchun 3D */}
                                <div className="content-box">
                                    <span className="card-title">{item.title}</span>
                                    <p className="card-content">{item.description}</p>
                                </div>
                                <div className="date-box">
                                    <span className="month">NOW</span>
                                    <span className="date">{index + 1}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

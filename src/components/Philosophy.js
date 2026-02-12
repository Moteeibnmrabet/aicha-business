import React from 'react';
import useScrollAnimation from '../hooks/useScrollAnimation';

const Philosophy = () => {
  const [sectionRef, isVisible] = useScrollAnimation({ once: true });
  const [textRef, textVisible] = useScrollAnimation({ once: true });

  return (
    <section id="philosophy" className="py-32 md:py-40 px-6 bg-off-white">
      <div className="max-w-4xl mx-auto">
        <h2 
          ref={sectionRef}
          className={`text-4xl md:text-6xl font-serif font-light text-center mb-20 md:mb-24 tracking-tight transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Notre Philosophie
        </h2>
        
        <div 
          ref={textRef}
          className={`space-y-8 text-lg md:text-xl font-serif font-light text-deep-black/80 leading-relaxed transition-all duration-1000 delay-200 ${
            textVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <p className="text-center">
            Chaque pièce que nous créons est le fruit d'un artisanat méticuleux, 
            où la tradition rencontre la modernité. Nos trousses ne sont pas simplement 
            des accessoires, mais des objets pensés pour durer, pour accompagner vos 
            moments précieux avec une élégance intemporelle.
          </p>
          
          <p className="text-center">
            Nous sélectionnons avec soin des matières durables et nobles : lin, coton 
            et velours de qualité supérieure, qui se patinent avec le temps pour 
            révéler leur caractère unique. Chaque couture est réalisée à la main, 
            chaque détail est pensé pour résister aux années.
          </p>
          
          <p className="text-center">
            Chez Aicha, nous croyons que le luxe véritable réside dans la simplicité 
            raffinée et le respect de l'artisanat traditionnel. Nos créations sont 
            conçues pour celles qui apprécient la beauté dans l'essentiel, qui 
            valorisent la qualité sur la quantité, et qui souhaitent investir dans 
            des pièces qui leur ressemblent.
          </p>
        </div>
      </div>
    </section>
  );
};

export default Philosophy;

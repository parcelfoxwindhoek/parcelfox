import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const faqs = [
  {
    question: "Do you offer same-day delivery in Windhoek?",
    answer:
      "Yes. We offer same-day pickup and delivery across Windhoek for orders placed before 4pm, Monday to Saturday. Urgent express slots are available on request — just call us to confirm timing.",
  },
  {
    question: "How much does a parcel delivery in Windhoek cost?",
    answer:
      "Pricing is based on distance and parcel size, with most local Windhoek deliveries starting from around N$60. Call or WhatsApp +264 81 633 6344 with your pickup and drop-off suburbs and we'll quote you upfront — no hidden fees.",
  },
  {
    question: "Can you collect and deliver medicine from pharmacies?",
    answer:
      "Yes. We regularly collect prescription and over-the-counter medicine from Windhoek pharmacies and deliver to your door. Send us the pharmacy details and prescription (where required) and we'll handle the rest discreetly and quickly.",
  },
  {
    question: "What areas of Windhoek do you cover?",
    answer:
      "We cover all of greater Windhoek — including the CBD, Klein Windhoek, Olympia, Pioneerspark, Eros, Khomasdal, Katutura, Auas Valley, Kleine Kuppe, Avis and surrounding suburbs.",
  },
  {
    question: "How do I book a delivery?",
    answer:
      "The fastest way is to call or WhatsApp us at +264 81 633 6344. Tell us the pickup address, drop-off address and what's being sent, and we'll confirm the price and ETA right away.",
  },
];

const FAQSection = () => (
  <section id="faq" className="py-20 bg-fox-navy">
    <div className="max-w-3xl mx-auto px-4">
      <div className="text-center mb-12">
        <div className="inline-block bg-fox-red/10 text-fox-red text-sm font-medium px-4 py-1.5 rounded-full mb-4">
          FAQ
        </div>
        <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-white mb-4">
          Delivery questions, answered
        </h2>
        <p className="text-white/60 max-w-xl mx-auto">
          Everything you need to know about same-day parcel delivery in Windhoek.
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem
            key={i}
            value={`item-${i}`}
            className="border border-white/10 rounded-lg px-5 bg-white/5"
          >
            <AccordionTrigger className="text-left text-white font-heading font-semibold hover:text-fox-red hover:no-underline">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="text-white/70 leading-relaxed">
              {faq.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  </section>
);

export default FAQSection;

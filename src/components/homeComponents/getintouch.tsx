'use client'

import React, { useRef } from 'react';
import { Mail, MapPin, Phone } from "lucide-react";
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

const GetintouchSection = () => {
  const contactRef = useRef(null); // Fixed: Declare the ref

  return (
    <section id="contact" className="py-16 bg-gray-50" ref={contactRef}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ amount: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-brand-dark via-blue-600 to-brand-dark text-center">Get in Touch</h2>
          <p className="text-center text-muted-foreground max-w-2xl mx-auto mb-12">
            Have questions about our technology or interested in implementing our solutions? Reach out to our team.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ amount: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-sm border"
          >
            <h3 className="text-xl font-semibold mb-6">Send us a message</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <label htmlFor="name" className="block text-sm font-medium mb-1">
                    Name
                  </label>
                  <Input id="name" placeholder="Your name" />
                </motion.div>
                <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">
                    Email
                  </label>
                  <Input id="email" type="email" placeholder="Your email" />
                </motion.div>
                <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone
                  </label>
                  <Input id="phone" placeholder="Your phone number" />
                </motion.div>
                <motion.div whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                  <label htmlFor="message" className="block text-sm font-medium mb-1">
                    Message
                  </label>
                  <Textarea id="message" placeholder="Your message" rows={4} />
                </motion.div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full">Submit Message</Button>
              </motion.div>
            </form>
          </motion.div>
          <div >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ amount: 0.5 }}
            className="bg-gray-900 text-white p-8 rounded-lg shadow-sm"
          >
            <h3 className="text-xl font-semibold mb-6">Request a Demo</h3>
            <p className="mb-6 text-gray-300">
              Interested in seeing our technology in action? Schedule a personalized demo with our team.
            </p>
            <form className="space-y-4">
              
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button className="w-full bg-white text-brand-dark">Request Demo</Button>
              </motion.div>
            </form>
            
          </motion.div>

          <div className="grid grid-cols-1 gap-4 mt-8 pt-8 border-t  bg-white text-brand-dark p-8 rounded-lg shadow-sm ">
              <h4 className="text-lg font-semibold mb-6">Contact Information</h4>
              <div className="space-y-6">
                <motion.div
                  className="flex items-start gap-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <MapPin className="h-5 w-5 text-brand-dark mt-0.5" />
                  <div>
                    <p className="text-brand-dark ">BP 73, Bureau de poste EL WIAM</p>
                    <p className="text-brand-dark">Sidi Bel Abbés 22016, Algérie</p>
                  </div>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Phone className="h-5 w-5 text-brand-dark" />
                  <p className="text-brand-dark">+213 (487) 687-18</p>
                </motion.div>
                <motion.div
                  className="flex items-center gap-3"
                  whileHover={{ x: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  <Mail className="h-5 w-5 text-brand-dark" />
                  <p className="text-brand-dark">info@neurevia.com</p>
                </motion.div>
              </div>
            </div>
          
            

          </div>

        </div>
      </div>
    </section>
  );
};

export default GetintouchSection;

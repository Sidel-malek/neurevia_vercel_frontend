"use client"

const partners = [
  {
    name: "Mayo Clinic",
    location: "Rochester, MN",
    type: "Medical Center",
  },
  {
    name: "Johns Hopkins Hospital",
    location: "Baltimore, MD",
    type: "Research Hospital",
  },
  {
    name: "Stanford Medical Center",
    location: "Stanford, CA",
    type: "Academic Center",
  },
  {
    name: "Massachusetts General Hospital",
    location: "Boston, MA",
    type: "Teaching Hospital",
  },
  {
    name: "Cleveland Clinic",
    location: "Cleveland, OH",
    type: "Medical Center",
  },
  {
    name: "UCSF Medical Center",
    location: "San Francisco, CA",
    type: "Academic Center",
  },
  {
    name: "Mount Sinai Hospital",
    location: "New York, NY",
    type: "Medical Center",
  },
  {
    name: "Duke University Hospital",
    location: "Durham, NC",
    type: "Academic Center",
  },
]

export default function PartnersSection() {
  return (
    <section className="py-20  bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-block mb-4">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wide">Collaboration Network</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Partners & Collaborators</h2>
          <p className=" text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We work closely with leading medical institutions, research centers, and healthcare providers to advance the
            field of neurodegenerative disease detection and treatment.
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl border border-gray-200 p-4 text-center hover:border-blue-300 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
            
              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {partner.name}
              </h3>

              <p className="text-sm text-gray-500 m-2">{partner.location}</p>

              <span className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-medium rounded-full">
                {partner.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

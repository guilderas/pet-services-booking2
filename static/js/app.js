const { useState, useEffect, useRef } = React;

function PetServicesApp() {
  const [petType, setPetType] = useState('');
  const [location, setLocation] = useState('');
  const [petService, setPetService] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [showPetDropdown, setShowPetDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [showServiceDropdown, setShowServiceDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const petTypes = [
    'Dogs','Cats','Rabbits','Hamsters','Guinea Pigs',
    'Chinchillas','Ferrets','Birds','Turtles','Iguanas'
  ];

  const locations = [
    'Central (District 1-2)','West (District 5-8, 22-23)',
    'East (District 14-18)','North (District 19-21, 26-28)',
    'South (District 3-4, 9-10)','North-East (District 11-13, 24-25)'
  ];

  const services = ['Grooming','Sitter','Pet Hotel'];

  const datePickerRef = useRef(null);

  useEffect(() => {
    if (datePickerRef.current) {
      flatpickr(datePickerRef.current, {
        mode: "range",
        dateFormat: "Y-m-d",
        minDate: "today",
        onChange: (_, dateStr) => setDateRange(dateStr)
      });
    }
  }, []);

  const toggleDropdown = (key) => {
    setShowPetDropdown(key === 'pet' ? !showPetDropdown : false);
    setShowLocationDropdown(key === 'location' ? !showLocationDropdown : false);
    setShowServiceDropdown(key === 'service' ? !showServiceDropdown : false);
  };

  const handleSearch = async () => {
    setLoading(true);
    setResults([]);
    try {
      const res = await fetch("/api/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petType, location, petService, dateRange })
      });
      const data = await res.json();
      setResults(data.results || []);
    } catch (e) {
      console.error(e);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <header>
        <div className="container header-content">
          <div className="logo">
            <i className="fas fa-paw"></i>
            Pawfect
          </div>
          <nav>
            <ul>
              <li><a href="#">Home</a></li>
              <li><a href="#">Services</a></li>
              <li><a href="#">About Us</a></li>
              <li><a href="#">Contact</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className="hero">
        <div className="container hero-content">
          <h1>Premium Pet Services Matching in Singapore</h1>
          <p>Find the best grooming, sitting, and hotel services for your beloved pets</p>
        </div>
      </section>

      <div className="container">
        <div className="search-section">
          <h2 className="search-title">Find the perfect service for your pet</h2>
          <div className="filters">
            {/* Pet Type */}
            <div className="filter-group">
              <label>Pet Type</label>
              <div className="dropdown">
                <div className="dropdown-select" onClick={() => toggleDropdown('pet')}>
                  <span>{petType || 'Select pet type'}</span>
                  <i className={`fas fa-chevron-${showPetDropdown ? 'up' : 'down'}`}></i>
                </div>
                <div className={`dropdown-list ${showPetDropdown ? 'show' : ''}`}>
                  {petTypes.map((pet, idx) => (
                    <div key={idx} className="dropdown-item"
                      onClick={() => { setPetType(pet); setShowPetDropdown(false); }}>
                      {pet}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Location */}
            <div className="filter-group">
              <label>Location</label>
              <div className="dropdown">
                <div className="dropdown-select" onClick={() => toggleDropdown('location')}>
                  <span>{location || 'Select location'}</span>
                  <i className={`fas fa-chevron-${showLocationDropdown ? 'up' : 'down'}`}></i>
                </div>
                <div className={`dropdown-list ${showLocationDropdown ? 'show' : ''}`}>
                  {locations.map((loc, idx) => (
                    <div key={idx} className="dropdown-item"
                      onClick={() => { setLocation(loc); setShowLocationDropdown(false); }}>
                      {loc}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Service */}
            <div className="filter-group">
              <label>Pet Service</label>
              <div className="dropdown">
                <div className="dropdown-select" onClick={() => toggleDropdown('service')}>
                  <span>{petService || 'Select service'}</span>
                  <i className={`fas fa-chevron-${showServiceDropdown ? 'up' : 'down'}`}></i>
                </div>
                <div className={`dropdown-list ${showServiceDropdown ? 'show' : ''}`}>
                  {services.map((svc, idx) => (
                    <div key={idx} className="dropdown-item"
                      onClick={() => { setPetService(svc); setShowServiceDropdown(false); }}>
                      {svc}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Date Range */}
            <div className="filter-group">
              <label>Date Range</label>
              <input
                type="text"
                className="date-range-input"
                placeholder="Select date range"
                ref={datePickerRef}
                value={dateRange}
                readOnly
              />
            </div>
          </div>

          <button className="btn-search" onClick={handleSearch} disabled={loading}>
            <i className="fas fa-search"></i> {loading ? "Searching..." : "Search Services"}
          </button>

          {/* Search results */}
          <div className="results">
            {results.map(r => (
              <div key={r.id} className="result-card">
                <h4>{r.title}</h4>
                <div className="result-meta">
                  <span><strong>Service:</strong> {r.service}</span> &nbsp;•&nbsp;
                  <span><strong>Location:</strong> {r.location}</span> &nbsp;•&nbsp;
                  <span><strong>Price:</strong> {r.price}</span>
                </div>
                <p style={{ marginTop: 8 }}>{r.description}</p>
              </div>
            ))}
            {(!loading && results.length === 0) && (
              <p style={{ marginTop: 12, color: '#666' }}>
                No results yet—try a search!
              </p>
            )}
          </div>
        </div>
      </div>

      <section className="services">
        <div className="container">
          <h2 className="section-title">Our Matching Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1525253013412-55c1a69a5738?auto=format&fit=crop&w=1170&q=80)' }}></div>
              <div className="service-content">
                <h3 className="service-title">Professional Grooming</h3>
                <p className="service-desc">Keep your pet looking and feeling their best with our professional grooming services.</p>
                <div className="service-price">From $35</div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1596272875729-ed2ff7d6d9c5?auto=format&fit=crop&w=1170&q=80)' }}></div>
              <div className="service-content">
                <h3 className="service-title">Pet Sitting</h3>
                <p className="service-desc">Trust our experienced sitters to care for your pet when you&apos;re away.</p>
                <div className="service-price">From $25/day</div>
              </div>
            </div>

            <div className="service-card">
              <div className="service-img" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1155&q=80)' }}></div>
              <div className="service-content">
                <h3 className="service-title">Pet Hotel</h3>
                <p className="service-desc">Luxurious accommodation for your pets with round-the-clock care.</p>
                <div className="service-price">From $40/night</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>Pawfect</h3>
              <p>Hassle-free booking with desired service providers.</p>
            </div>
            <div className="footer-column">
              <h3>Services</h3>
              <ul>
                <li><a href="#">Pet Grooming</a></li>
                <li><a href="#">Pet Sitting</a></li>
                <li><a href="#">Pet Hotel</a></li>
                <li><a href="#">Veterinary Services</a></li>
              </ul>
            </div>
            <div className="footer-column">
              <h3>Contact Us</h3>
              <ul>
                <li><i className="fas fa-phone"></i> +65 6123 4567</li>
                <li><i className="fas fa-envelope"></i> hello@pawfect.sg</li>
                <li><i className="fas fa-map-marker-alt"></i> 123 Pet Road, Singapore 123456</li>
              </ul>
            </div>
          </div>
          <div className="copyright">
            <p>&copy; 2025 Pawfect. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<PetServicesApp />);

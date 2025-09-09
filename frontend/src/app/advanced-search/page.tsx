export default function AdvancedSearchPage() {
  return (
    <section className="container">
      <h1>Advanced Search</h1>

      <form className="advanced-form">
        <div className="row">
          <label>Keyword</label>
          <input type="text" name="q" placeholder="Technology, industry, or theme..." />
        </div>

        <div className="row">
          <label>Sector</label>
          <select name="sector">
            <option value="">All</option>
            <option>Agriculture</option>
            <option>AI / Machine Learning</option>
            <option>Cybersecurity</option>
            <option>Energy</option>
            <option>E-commerce</option>
            <option>Fintech</option>
            <option>HealthTech</option>
            <option>Mobility & Transportation</option>
          </select>
        </div>

        <div className="row">
          <label>Maturity</label>
          <select name="maturity">
            <option value="">All</option>
            <option value="idea">Idea</option>
            <option value="prototype">Prototype</option>
            <option value="growth">Early Growth</option>
            <option value="scale">Scaling</option>
            <option value="established">Established</option>
          </select>
        </div>

        <div className="row">
          <label>Location</label>
          <input type="text" name="location" placeholder="City or country" />
        </div>

        <div className="actions">
          <button type="submit" className="btn btn-primary">Search</button>
          <button type="reset" className="btn">Reset</button>
        </div>
      </form>
    </section>
  );
}

const Banner = () => {
  return (
    <>
      <div
        className="hero min-h-screen"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/ddtxhh5a1/image/upload/v1707822156/pjuwsizxb7c92hqrzrup.jpg)",
        }}
      >
        <div className="hero-overlay bg-opacity-60"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">
              Discover Your Perfect Watch
            </h1>
            <p className="mb-5">
              Explore our collection of finely crafted timepieces, designed to
              elevate your style and enhance your everyday adventures. Whether
              you're seeking sophistication, precision, or rugged durability,
              find your perfect companion here.
            </p>
            <button className="btn btn-primary">Explore Now</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Banner;

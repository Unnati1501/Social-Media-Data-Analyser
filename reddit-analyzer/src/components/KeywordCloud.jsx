function KeywordCloud({ keywords }) {
  return (
    <>
      <h2>Top Keywords</h2>

      {keywords.map((word) => (
        <span
          key={word}
          style={{
            margin: "5px",
            padding: "8px",
            border: "1px solid gray",
            borderRadius: "20px",
            display: "inline-block",
          }}
        >
          {word}
        </span>
      ))}
    </>
  );
}

export default KeywordCloud;
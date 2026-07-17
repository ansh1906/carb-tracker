const getDiabetesNews = async () => {
  const response = await fetch(
    `http://api.mediastack.com/v1/news?access_key=${process.env.MEDIASTACK_API_KEY}&keywords=diabetes&languages=en&limit=30`
  );

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Mediastack API error: ${response.status} - ${errText}`);
  }

  const data = await response.json();

  return (data.data || []).map((article) => ({
    ...article,
    category: 'news',
    categoryLabel: 'Diabetes News',
  }));
};

module.exports = { getDiabetesNews };
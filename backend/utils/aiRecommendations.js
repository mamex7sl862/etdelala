const natural = require("natural");
const TfIdf = natural.TfIdf;
const tokenizer = new natural.WordTokenizer();

// Function to get job recommendations for seeker
exports.recommendJobs = async (seekerId) => {
  const seeker = await JobSeeker.findById(seekerId);
  const jobs = await Job.find({ approved: true });

  const tfidf = new TfIdf();
  const seekerDoc = `${seeker.skills.join(" ")} ${seeker.experience
    .map((exp) => exp.description)
    .join(" ")}`;
  tfidf.addDocument(tokenizer.tokenize(seekerDoc));

  const similarities = jobs.map((job, index) => {
    const jobDoc = `${job.skillsRequired.join(" ")} ${job.description}`;
    tfidf.addDocument(tokenizer.tokenize(jobDoc));
    return {
      job,
      similarity: tfidf.tfidfSimilarity(0, index + 1), // Compare to seeker doc (index 0)
    };
  });

  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, 10).map((s) => s.job);
};

// Function to recommend candidates for job
exports.recommendCandidates = async (jobId) => {
  const job = await Job.findById(jobId);
  const seekers = await JobSeeker.find();

  const tfidf = new TfIdf();
  const jobDoc = `${job.skillsRequired.join(" ")} ${job.description}`;
  tfidf.addDocument(tokenizer.tokenize(jobDoc));

  const similarities = seekers.map((seeker, index) => {
    const seekerDoc = `${seeker.skills.join(" ")} ${seeker.experience
      .map((exp) => exp.description)
      .join(" ")}`;
    tfidf.addDocument(tokenizer.tokenize(seekerDoc));
    return {
      seeker,
      similarity: tfidf.tfidfSimilarity(0, index + 1),
    };
  });

  similarities.sort((a, b) => b.similarity - a.similarity);
  return similarities.slice(0, 10).map((s) => s.seeker);
};

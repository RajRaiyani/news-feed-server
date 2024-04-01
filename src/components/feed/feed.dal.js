exports.upsert = async (dbClient, feed) => {
  const { title, pubDate, description } = feed;

  const sqlStmt = 'INSERT INTO "feed" ("title","publishedAt","document","content") VALUES ($1, $2, $3, $4) on conflict do nothing returning "id";';

  const document = description.replace(/<[^>]*>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();

  const params = [title, pubDate, document, description];

  const res = await dbClient.query(sqlStmt, params);

  return res.rows[0]?.id;
};

exports.list = async (dbClient, limit = 10, offset = 0, tokens = []) => {
  const sqlStmt = `
        SELECT 
          "id","title","publishedAt","document","content",match_score("document",$1) as "matchScore" 
        FROM "feed" 
        ${tokens.length ? 'where match_score("document",$1) > 0' : ''}
        ORDER BY 
          "matchScore" desc ,"publishedAt" DESC 
        LIMIT $2 OFFSET $3;
      `;

  const params = [tokens, limit, offset];

  const res = await dbClient.query(sqlStmt, params);

  return res.rows;
};

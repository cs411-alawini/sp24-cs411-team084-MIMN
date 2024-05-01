DELIMITER $$

CREATE PROCEDURE GetUniversityRecommendations(IN user_id VARCHAR(255))
BEGIN
    -- Temporary table to store recommended universities
    CREATE TEMPORARY TABLE RecommendedUniversities (
        university_id INT
    );

    -- Insert universities into the temporary table based on user's scores and preferences
    INSERT INTO RecommendedUniversities
    SELECT DISTINCT u.university_id
    FROM application AS a
    LEFT JOIN university u ON u.university_id = a.university
    WHERE a.user_id = user_id
    AND a.gre_q >= (SELECT AVG(gre_q) FROM application)
    AND a.gre_v >= (SELECT AVG(gre_v) FROM application)
    AND a.decision = 'Accepted'
    LIMIT 15;

    -- Fetch detailed profiles of top 10 applicants from recommended universities
    SELECT a.user_id, a.application_id, a.degree, a.term, a.decision,
           a.gre_q, a.gre_v, a.gre_awa, a.gpa, u.name AS university_name
    FROM application a
    INNER JOIN RecommendedUniversities r ON a.university = r.university_id
    INNER JOIN university u ON u.university_id = r.university_id
    WHERE a.decision = 'Accepted'
    ORDER BY a.gpa DESC, a.gre_q DESC, a.gre_v DESC
    LIMIT 10;

    -- Cleanup temporary table
    DROP TEMPORARY TABLE RecommendedUniversities;
END$$

DELIMITER ;
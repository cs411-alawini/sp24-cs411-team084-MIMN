# UML Design

## UML Diagram
!["uml_graph"](./images/2_uml_diagram.png)

## Entities
### 1. User
- **Description:** A user is an individual who creates an account on the website. It keeps track of a user's account information (username, password, etc.) and user academic profile (GPA, GRE, status, etc.).
- **Assumption:** We assume each user can only create one account, thus the information is unique which is identified by `user_id`.
- It is modeled as an entity because of its role in symbolizing the website's user. Ths user entity enables interactions with multiple other entities including liking a university, posting an application etc.

### 2. University
- **Description:** This entity represents graduate-level institutions, containing a university's name as its primary attribute.
- **Assumption:** Each university has a distinct name, associated with a unique `university_id`.
- It is modeled as an entity to allow for relationships between ranking, application, and user. This enables the website to collect admission statistics and rankings at the university-level.

### 3. Area
- **Description:** Denotes fields of study within computer science, containing a area's name as its primary attribute.
- **Assumption:** Each area is distinct, with a name identified by a unique `area_id`.
- It is modeled as an entity to allow for connections between rankings and users, allowing users to specify their interests in multiple areas to obtain tailored matches. Additionally, it supports tracking of university rankings in each area.

### 4. Application
- **Description:** Captures the exisiting applications within our dataset, including an applicant's academic background (GPA, GRE, status, etc.), application outcome (decision, date), and the university they applied to.
- **Assumption:** Every application is considered unique with an exclusive `application_id`.
- It is modeled as an entity to support relationships with both universities and users, allowing users to post their application records. Moreover, the relationship between university and application contributes to analyzing the application statistics for each university.

### 5. Ranking
**Description:** Represents the relative standing for each university in various areas of study.
- **Assumption:** Each ranking record is unique, differentiated by an external key pair consisting of `university_id` and `area_id`.
- It is modeled as a weak entity to allow for relationships with areas and universities, reflecting the variability in university rankings across different specializations. It is a weak entity as it relies on the `university` and `area` to define itself.

## Relationships
### 1. User - University: like
- **Many to Many:** Each user is required to pick an array of "dream universitys" they favor optionally, and each university can be favored by a varying number of students, from none to many.
- **Assumption:** The relationship is based on a specific constraint of the website. When users create accounts, they will be prompted to identify their "dream universities" voluntarily. Consequently, tt is possible for certain universities to be not favored by any user.

### 2. Application - Unviersity: apply
- **One to Many:** Each application is restricted to applying to one university, while each university may receive none to many applications.
- **Assumption:** This comes from the requirement of typical college application process, with the specification of a single university per application. It is possible that certain universities receives no applications within our dataset.

### 3. User - Application: post
- **One to Many:** A single user can post multiple application results. However, each application must be associated exclusively with one user.
- **Assumption:** We encourage users to submit application results to contribute to the community voluntarily, allowing for submission of multiple results or opting not to participate. Meanwhile, each application must be traceable to a specific applicant.

### 4. User - Area: interested
- **One to Many:** A user may express interest in just one area, while each area may attract interest from zero or many students.
- **Assumption:** This comes from the website constraint. When users create accounts, they will be prompted to indicate areas of interest for customized matches. It is possible that a certain area might not captivate the interest of any user.

### 5. University - Ranking: has
- **One to Many:** Each university may have multiple rankings across various areas of study. However, each ranking record must be associated with one university.
- **Assumption:** Given that we multiple areas, each universtiy may achieve rankings in several fields. It is possible that a university may not be featured in the ranking system (e.g. not within the CSRankings top 100) or to hold positions across multiple areas.

### 6. Area - Ranking: in
- **One to Many:** Each area is expected to have at least one ranking record, representing universities standings within that particular field of study. Conversely, each ranking is uniquely linked to a single area.
- **Assumption:** This comes from the structure of our dataset. Each area is represented through various ranking records, and each of these records is dedicated to a particular area.

## Normalization

### 1. Relations based on ERD
```
    User(user_id, username, email, password, gre_q, gre_v, gre_awa, gpa, status, dream_area)
    University(university_id, name)
    Area(area_id, name)
    Application(application_id, degree, term, decision, gre_q, gre_v, gre_awa, gpa, status, university, date)
    Ranking(university_id, area_id, ranking)
```

### 2. 3NF
**User:** Contains basic user information and login information.  
```
user_id -> username, email, password, status
```

**UserGpa:** Stores the user's GPA and is associated with the User table via user_id.  
```
user_id -> gpa
```

**UserGre:** Contains the user's GRE test scores, which are associated with the User table via user_id.  
```
user_id -> gre_q, gre_v, gre_awa
```

**University:** Contains basic information about the university.  
```
university_id -> name
```

**Area:** Contains information on areas of study.  
```
area_id -> name
```

**UserDreamUniversities:** Indicates the relationship between a user and dream university, with each user being able to select a dream university.  
```
user_id -> university_id
university_id -> user_id
```

**Application:** Stores the user's application information, associated with the User table via user_id and with the University table via university_id.  
```
application_id, user_id, university_id -> degree, term, decision, date
```

**ApplicationScores:** Stores information about the grades associated with an application and is associated with the Application table through application_id.  
```
application_id -> gre_q, gre_v, gre_awa
```

**Ranking:** Contains university rankings in different research areas, associated with the University table by university_id and with the Area table by area_id.  
```
university_id, area_id -> ranking
```

**UserInterest:** Indicates the user's interest in different research areas and is a join table of one-to-many relationships.  
```
user_id -> area_id
area_id -> user_id
```

### 3. Why 3NF Not BCNF
- 3NF is more flexible compared to BCNF. BCNF can lead to loss of functional dependencies.
- 3NF is usually easier to understand and use because it is not as strict as BCNF. 
- 3NF provides a good balance between normalization and functionality. BCNF may require additional tables and more complex connection operations.
- BCNF can lead to excessive table decomposition, which can negatively impact database performance.
- 3NF helps create a flexible data model that can more easily adapt to future changes, such as adding new attributes or new data types.





## Logical Design
**1. Users**
```
Users ( 
    Column1: user_id INT [PK],  
    Column2: username VARCHAR(100),  
    Column3: email VARCHAR(100),  
    Column4: password VARCHAR(100),  
    Column5: gre_q INT,  
    Column6: gre_v INT,  
    Column7: gre_awa REAL,  
    Column8: gpa REAL,  
    Column9: status VARCHAR(100),  
    Column10: dream_area INT [FK to Area.area_id]
)
```

**2. Like**
```
Like (
    Column1: user_id INT [PK] [FK to Users.user_id],  
    Column2: interested_university INT [PK] [FK to University.university_id]
)
```

**3. Area**  
```
Area (
    Column1: area_id INT [PK],  
    Column2: name VARCHAR(100)
)
```

**4. Ranking**
```
Ranking (
    Column1: university_id INT [PK][FK to University.university_id],
    Column2: area_id INT [PK][FK to Area.area_id],
    Column3: ranking INT
)
```
**5. University**
```
University (
    Column1: university_id INT [PK],
    Column2: name VARCHAR(100)
)
```

**6. Application**  
```
Application ( 
    Column1: user_id INT [FK  to User.user_id],  
    Column2: application_id INT [PK],  
    Column3: degree VARCHAR(100),  
    Column4: term VARCHAR(100),  
    Column5: decision VARCHAR(100),  
    Column6: gre_q INT,  
    Column7: gre_v INT,  
    Column8: gre_awa REAL,  
    Column9: gpa REAL,  
    Column10: status VARCHAR(100),  
    Column11: university INT [FK to University.university_id],  
    Column12: date DATE
)
```
-- 테이블명이 segments이고, IDENTITY 전략을 쓰는 PostgreSQL/혹은 호환 설정 가정
INSERT INTO segments (name, parent_id) VALUES ('이커머스', NULL);
INSERT INTO segments (name, parent_id) VALUES ('여행', NULL);
INSERT INTO segments (name, parent_id) VALUES ('교육', NULL);
INSERT INTO segments (name, parent_id) VALUES ('금융', NULL);

-- 이커머스 하위 세그먼트 (parent_id = 1)
INSERT INTO segments (name, parent_id) VALUES ('의류/패션', 1);
INSERT INTO segments (name, parent_id) VALUES ('전자제품', 1);
INSERT INTO segments (name, parent_id) VALUES ('식품/음료', 1);

-- 여행 하위 세그먼트 (parent_id = 2)
INSERT INTO segments (name, parent_id) VALUES ('국내여행', 2);
INSERT INTO segments (name, parent_id) VALUES ('해외여행', 2);
INSERT INTO segments (name, parent_id) VALUES ('항공/숙박', 2);

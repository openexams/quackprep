create table announcements
(
    id   int auto_increment
        primary key,
    text varchar(300) charset utf8mb3 null
)
    comment '1 column that if no null will show up on the site as a banner at the top.';

create table class_categories
(
    id          int auto_increment
        primary key,
    name        varchar(100) not null,
    description varchar(255) null,
    constraint id_UNIQUE
        unique (id),
    constraint name_UNIQUE
        unique (name)
)
    comment 'master data that maps category name to id';

create table group_types
(
    id        int auto_increment
        primary key,
    type_name varchar(45) not null
);

create table schools
(
    id          int auto_increment
        primary key,
    school_name varchar(256)      not null,
    color       varchar(45)       not null,
    deleted     tinyint default 0 not null,
    description varchar(100)      not null,
    constraint id_UNIQUE
        unique (id),
    constraint school_name_UNIQUE
        unique (school_name)
);

create table users
(
    id            int auto_increment
        primary key,
    username      varchar(25)                          not null,
    password_hash varchar(255)                         null,
    email         varchar(100)                         not null,
    first_name    varchar(50)                          null,
    last_name     varchar(50)                          null,
    created_at    datetime   default CURRENT_TIMESTAMP not null,
    updated_at    datetime   default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    last_login    datetime                             null,
    icon          varchar(2048)                        null,
    provider      varchar(64)                          not null,
    provider_id   varchar(2048)                        not null,
    is_creator    tinyint(1) default 0                 not null,
    constraint unique_users_email
        unique (email)
)
    comment 'Main storage of users, updated_at always updates when row is edited. Primary key is auto incrementing id';

create table api_keys
(
    id         int auto_increment
        primary key,
    api_key    varchar(512)                       not null,
    created_at datetime default CURRENT_TIMESTAMP not null,
    updated_at datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    note       varchar(2048)                      not null,
    created_by int                                null,
    user_id    int                                not null,
    constraint idapi_keys_UNIQUE
        unique (id),
    constraint key_UNIQUE
        unique (api_key),
    constraint api_user_to_user
        foreign key (user_id) references users (id)
            on update cascade on delete cascade,
    constraint user_link_api
        foreign key (created_by) references users (id)
            on update cascade on delete cascade
);

create index user_link_idx
    on api_keys (created_by);

create index user_link_new_api_user_idx
    on api_keys (user_id);

create table classes
(
    id          int auto_increment
        primary key,
    name        varchar(100)                       not null,
    description varchar(256)                       null,
    category    int                                not null,
    created_at  datetime default CURRENT_TIMESTAMP not null,
    updated_at  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    school_id   int                                not null,
    deleted     tinyint  default 0                 not null,
    created_by  int                                not null,
    constraint id_UNIQUE
        unique (id),
    constraint category_fk
        foreign key (category) references class_categories (id),
    constraint created_by_link
        foreign key (created_by) references users (id)
            on update cascade on delete cascade,
    constraint school_link
        foreign key (school_id) references schools (id)
            on update cascade on delete cascade
);

create table cgroups
(
    id         int auto_increment
        primary key,
    name       varchar(256)                       not null,
    type       int                                not null,
    `desc`     varchar(512)                       not null,
    created_by int                                not null,
    updated_at datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    created_at datetime default CURRENT_TIMESTAMP not null,
    class_id   int                                not null,
    deleted    tinyint  default 0                 not null,
    constraint class_group_link
        foreign key (class_id) references classes (id)
            on update cascade on delete cascade,
    constraint group_created_by_user_link
        foreign key (created_by) references users (id)
            on update cascade on delete cascade,
    constraint group_type_link
        foreign key (type) references group_types (id)
);

create index class_group_link_idx
    on cgroups (class_id);

create index group_created_by_user_link_idx
    on cgroups (created_by);

create index group_type_link_idx
    on cgroups (type);

create table class_votes
(
    id         int auto_increment
        primary key,
    vote       tinyint                            not null,
    class_id   int                                not null,
    user_id    int                                not null,
    created_at datetime default CURRENT_TIMESTAMP not null,
    updated_at datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    constraint unique_one_user_vote_to_certain_class
        unique (user_id, class_id),
    constraint class_votes_classes_id_fk
        foreign key (class_id) references classes (id)
            on update cascade on delete cascade,
    constraint class_votes_users_id_fk
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
);

create index category_fk_idx
    on classes (category);

create index created_by_link_idx
    on classes (created_by);

create index school_link_idx
    on classes (school_id);

create table group_file_inserts
(
    id       int auto_increment
        primary key,
    link     varchar(4096) not null,
    group_id int           not null comment 'what group was this file uploaded with?',
    constraint many_files_to_one_group
        foreign key (group_id) references cgroups (id)
            on update cascade on delete cascade
)
    comment 'when a user uses the ai exam parser the files they input get added here.';

create table pdfs
(
    id         int auto_increment
        primary key,
    link       varchar(4096)     not null,
    class_id   int               not null,
    created_by int               not null,
    deleted    tinyint default 0 not null,
    name       varchar(64)       not null,
    constraint id_UNIQUE
        unique (id),
    constraint class_pdf_link
        foreign key (class_id) references classes (id)
            on update cascade on delete cascade,
    constraint user_pdf_link
        foreign key (created_by) references users (id)
            on update cascade on delete cascade
);

create index clas_pdf_link_idx
    on pdfs (class_id);

create index user_pdf_link_idx
    on pdfs (created_by);

create table questions
(
    id              int auto_increment
        primary key,
    question        text                               not null,
    created_at      datetime default CURRENT_TIMESTAMP not null,
    updated_at      datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    created_by      int                                not null,
    deleted         tinyint  default 0                 not null,
    explanation_url varchar(4096)                      null,
    ai              tinyint  default 0                 not null,
    constraint id_UNIQUE
        unique (id),
    constraint questions_created_by_link
        foreign key (created_by) references users (id)
            on update cascade on delete cascade
)
    comment 'if question ai generated then choices MUST BE too';

create table choices
(
    id          int auto_increment
        primary key,
    answer      text                                          not null,
    is_correct  tinyint                                       not null,
    created_at  timestamp           default CURRENT_TIMESTAMP not null,
    updated_at  timestamp           default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    created_by  int                                           not null,
    deleted     tinyint             default 0                 not null,
    question_id int                                           not null,
    type        enum ('mcq', 'frq') default 'mcq'             not null,
    constraint id_UNIQUE
        unique (id),
    constraint question_choice_link
        foreign key (question_id) references questions (id)
            on update cascade on delete cascade,
    constraint user_link
        foreign key (created_by) references users (id)
            on update cascade on delete cascade
);

create table answers_transactional
(
    id         int auto_increment
        primary key,
    choice_id  int                                not null,
    created_by int                                null,
    created_at datetime default CURRENT_TIMESTAMP not null,
    text       varchar(2048)                      null,
    constraint id_UNIQUE
        unique (id),
    constraint choice_fk
        foreign key (choice_id) references choices (id)
            on update cascade on delete cascade,
    constraint user_fk
        foreign key (created_by) references users (id)
            on update cascade on delete set null
)
    comment 'prob should add more tracking but good for now.';

create table answers_current
(
    id          int auto_increment
        primary key,
    created_by  int                                not null,
    choice_id   int                                not null,
    created_at  datetime default CURRENT_TIMESTAMP not null,
    updated_at  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    question_id int                                not null,
    trans_id    int                                not null comment 'answers_transactional id always keeps the latest',
    constraint id_UNIQUE
        unique (id),
    constraint user_only_have_1_current_choice_per_q
        unique (question_id, created_by),
    constraint answers_current__to_trans
        foreign key (trans_id) references answers_transactional (id)
            on update cascade on delete cascade,
    constraint choices_link
        foreign key (choice_id) references choices (id)
            on update cascade on delete cascade,
    constraint question_link
        foreign key (question_id) references questions (id)
            on update cascade on delete cascade,
    constraint users_link
        foreign key (created_by) references users (id)
            on update cascade on delete cascade
)
    comment 'keeps the users current mcq answers held here, so like if it shows the question as already answered this is why.';

create index choices_link_idx
    on answers_current (choice_id);

create index question_link_idx
    on answers_current (question_id);

create index users_link_idx
    on answers_current (created_by);

create index answer_fk_idx
    on answers_transactional (choice_id);

create index user_fk_idx
    on answers_transactional (created_by);

create index question_link_idx
    on choices (question_id);

create index user_link_idx
    on choices (created_by);

create table favorite_questions
(
    id          int auto_increment
        primary key,
    question_id int               not null,
    is_favorite tinyint default 0 not null,
    user_id     int               not null,
    constraint id_UNIQUE
        unique (id),
    constraint user_and_question_make_unique_row
        unique (user_id, question_id),
    constraint question_fav_link
        foreign key (question_id) references questions (id)
            on update cascade on delete cascade,
    constraint user_question_fav_link
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
);

create index question_fav_link_idx
    on favorite_questions (question_id);

create index user_question_fav_link_idx
    on favorite_questions (user_id);

create table frq_ai_response
(
    response varchar(1000) not null,
    grade    int           not null,
    trans_id int           not null,
    id       int auto_increment
        primary key,
    constraint frq_ai_response_pk
        unique (id),
    constraint frq_ai_response_pk_2
        unique (trans_id),
    constraint trans_id
        unique (trans_id),
    constraint ai_repsonse_to_ans_trans
        foreign key (trans_id) references answers_transactional (id)
            on update cascade on delete cascade
)
    comment 'models/queston/ai';

create table group_question
(
    id          int auto_increment
        primary key,
    group_id    int not null,
    question_id int not null,
    constraint unique_g_q
        unique (group_id, question_id),
    constraint gq_link_group
        foreign key (group_id) references cgroups (id)
            on update cascade on delete cascade,
    constraint gq_question_link
        foreign key (question_id) references questions (id)
            on update cascade on delete cascade
);

create index gq_link_group_idx
    on group_question (group_id);

create index gq_question_link_idx
    on group_question (question_id);

create table question_forum_posts
(
    id          int auto_increment
        primary key,
    question_id int                                not null,
    text        varchar(2048)                      not null,
    post_id     int                                null,
    deleted     tinyint  default 0                 not null,
    created_by  int                                not null,
    created_at  datetime default CURRENT_TIMESTAMP not null,
    updated_at  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    constraint link_post_to_who_created_it
        foreign key (created_by) references users (id)
            on update cascade on delete cascade,
    constraint post_to_itself
        foreign key (post_id) references question_forum_posts (id)
            on update cascade on delete cascade,
    constraint post_to_queston_link
        foreign key (question_id) references questions (id)
            on update cascade on delete cascade
)
    comment 'under question page is comments section where users can post "hey this question answer is incorrect" etc';

create table question_reports
(
    id           int auto_increment
        primary key,
    created_by   int                                not null,
    text         varchar(4096)                      not null,
    marked_fixed tinyint  default 0                 not null,
    created_at   datetime default CURRENT_TIMESTAMP not null,
    updated_at   datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    question_id  int                                not null,
    constraint idquestion_reports_UNIQUE
        unique (id),
    constraint question_report_to_user_link
        foreign key (created_by) references users (id)
            on update cascade on delete cascade,
    constraint question_to_question_report_link
        foreign key (question_id) references questions (id)
            on update cascade on delete cascade
);

create index question_report_to_user_link_idx
    on question_reports (created_by);

create index question_to_question_report_link_idx
    on question_reports (question_id);

create table question_votes
(
    id          int auto_increment
        primary key,
    user_id     int                                not null,
    question_id int                                not null,
    vote        tinyint                            not null comment '1 is upvote 0 is downvote',
    created_at  datetime default CURRENT_TIMESTAMP not null,
    updated_at  datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    constraint unique_user_vote_on_question
        unique (user_id, question_id),
    constraint question_votes__question_fk
        foreign key (question_id) references questions (id)
            on update cascade on delete cascade,
    constraint question_votes__user_fk
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
)
    comment 'upserts users vote on a question';

create index questions_created_by_link_idx
    on questions (created_by);

create table streak
(
    user_id        int                                not null
        primary key,
    current_streak int                                not null,
    longest_streak int                                not null,
    last_claim     datetime                           not null,
    created_at     datetime default CURRENT_TIMESTAMP not null,
    updated_at     datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    constraint streak_ibfk_1
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
)
    comment 'references the user table, holds data about the users streak data';

create table time_spent
(
    user_id    int                                not null
        primary key,
    time_spent int                                not null,
    updated_at datetime default CURRENT_TIMESTAMP not null on update CURRENT_TIMESTAMP,
    created_at datetime default CURRENT_TIMESTAMP not null,
    constraint user_id_UNIQUE
        unique (user_id),
    constraint `user_id link`
        foreign key (user_id) references users (id)
            on update cascade on delete cascade
);


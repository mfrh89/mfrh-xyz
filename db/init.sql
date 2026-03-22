CREATE TYPE public.enum__cover_letter_v_version_status AS ENUM (
    'draft',
    'published'
);
CREATE TYPE public.enum__cv_v_version_status AS ENUM (
    'draft',
    'published'
);
CREATE TYPE public.enum_cover_letter_status AS ENUM (
    'draft',
    'published'
);
CREATE TYPE public.enum_cv_status AS ENUM (
    'draft',
    'published'
);
CREATE TABLE public._cover_letter_v (
    id integer NOT NULL,
    version_recipient_salutation character varying,
    version_body character varying,
    version_closing character varying,
    version_sender_name character varying,
    version__status public.enum__cover_letter_v_version_status DEFAULT 'draft'::public.enum__cover_letter_v_version_status,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);
CREATE SEQUENCE public._cover_letter_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public._cover_letter_v_id_seq OWNED BY public._cover_letter_v.id;
CREATE TABLE public._cv_v (
    id integer NOT NULL,
    version_name character varying,
    version_title character varying,
    version_email character varying,
    version_phone character varying,
    version_linkedin character varying,
    version_profile_image_id integer,
    version_logo_id integer,
    version_summary character varying,
    version_skill_max_dots numeric DEFAULT 5,
    version__status public.enum__cv_v_version_status DEFAULT 'draft'::public.enum__cv_v_version_status,
    version_updated_at timestamp(3) with time zone,
    version_created_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    latest boolean
);
CREATE SEQUENCE public._cv_v_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public._cv_v_id_seq OWNED BY public._cv_v.id;
CREATE TABLE public._cv_v_version_certificates (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    issuer character varying,
    date character varying,
    status character varying,
    _uuid character varying
);
CREATE SEQUENCE public._cv_v_version_certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public._cv_v_version_certificates_id_seq OWNED BY public._cv_v_version_certificates.id;
CREATE TABLE public._cv_v_version_education (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    institution character varying,
    degree character varying,
    start_date character varying,
    end_date character varying,
    _uuid character varying
);
CREATE SEQUENCE public._cv_v_version_education_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public._cv_v_version_education_id_seq OWNED BY public._cv_v_version_education.id;
CREATE TABLE public._cv_v_version_experience (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    duration character varying,
    start_date character varying,
    end_date character varying,
    company character varying,
    role character varying,
    description character varying,
    _uuid character varying
);
CREATE SEQUENCE public._cv_v_version_experience_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public._cv_v_version_experience_id_seq OWNED BY public._cv_v_version_experience.id;
CREATE TABLE public._cv_v_version_languages (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    level character varying,
    _uuid character varying
);
CREATE SEQUENCE public._cv_v_version_languages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public._cv_v_version_languages_id_seq OWNED BY public._cv_v_version_languages.id;
CREATE TABLE public._cv_v_version_skills (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id integer NOT NULL,
    name character varying,
    level numeric DEFAULT 4,
    _uuid character varying
);
CREATE SEQUENCE public._cv_v_version_skills_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public._cv_v_version_skills_id_seq OWNED BY public._cv_v_version_skills.id;
CREATE TABLE public.cover_letter (
    id integer NOT NULL,
    recipient_salutation character varying,
    body character varying,
    closing character varying,
    sender_name character varying,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone,
    _status public.enum_cover_letter_status DEFAULT 'draft'::public.enum_cover_letter_status
);
CREATE SEQUENCE public.cover_letter_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.cover_letter_id_seq OWNED BY public.cover_letter.id;
CREATE TABLE public.cv (
    id integer NOT NULL,
    name character varying,
    title character varying,
    email character varying,
    phone character varying,
    linkedin character varying,
    profile_image_id integer,
    logo_id integer,
    summary character varying,
    skill_max_dots numeric DEFAULT 5,
    updated_at timestamp(3) with time zone,
    created_at timestamp(3) with time zone,
    _status public.enum_cv_status DEFAULT 'draft'::public.enum_cv_status
);
CREATE TABLE public.cv_certificates (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying,
    issuer character varying,
    date character varying,
    status character varying
);
CREATE TABLE public.cv_education (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    institution character varying,
    degree character varying,
    start_date character varying,
    end_date character varying
);
CREATE TABLE public.cv_experience (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    duration character varying,
    start_date character varying,
    end_date character varying,
    company character varying,
    role character varying,
    description character varying
);
CREATE SEQUENCE public.cv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.cv_id_seq OWNED BY public.cv.id;
CREATE TABLE public.cv_languages (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying,
    level character varying
);
CREATE TABLE public.cv_skills (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    name character varying,
    level numeric DEFAULT 4
);
CREATE TABLE public.media (
    id integer NOT NULL,
    alt character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    url character varying,
    thumbnail_u_r_l character varying,
    filename character varying,
    mime_type character varying,
    filesize numeric,
    width numeric,
    height numeric,
    focal_x numeric,
    focal_y numeric
);
CREATE SEQUENCE public.media_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.media_id_seq OWNED BY public.media.id;
CREATE TABLE public.payload_kv (
    id integer NOT NULL,
    key character varying NOT NULL,
    data jsonb NOT NULL
);
CREATE SEQUENCE public.payload_kv_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.payload_kv_id_seq OWNED BY public.payload_kv.id;
CREATE TABLE public.payload_locked_documents (
    id integer NOT NULL,
    global_slug character varying,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.payload_locked_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.payload_locked_documents_id_seq OWNED BY public.payload_locked_documents.id;
CREATE TABLE public.payload_locked_documents_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    media_id integer,
    users_id integer
);
CREATE SEQUENCE public.payload_locked_documents_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.payload_locked_documents_rels_id_seq OWNED BY public.payload_locked_documents_rels.id;
CREATE TABLE public.payload_migrations (
    id integer NOT NULL,
    name character varying,
    batch numeric,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.payload_migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.payload_migrations_id_seq OWNED BY public.payload_migrations.id;
CREATE TABLE public.payload_preferences (
    id integer NOT NULL,
    key character varying,
    value jsonb,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL
);
CREATE SEQUENCE public.payload_preferences_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.payload_preferences_id_seq OWNED BY public.payload_preferences.id;
CREATE TABLE public.payload_preferences_rels (
    id integer NOT NULL,
    "order" integer,
    parent_id integer NOT NULL,
    path character varying NOT NULL,
    users_id integer
);
CREATE SEQUENCE public.payload_preferences_rels_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.payload_preferences_rels_id_seq OWNED BY public.payload_preferences_rels.id;
CREATE TABLE public.users (
    id integer NOT NULL,
    updated_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    created_at timestamp(3) with time zone DEFAULT now() NOT NULL,
    email character varying NOT NULL,
    reset_password_token character varying,
    reset_password_expiration timestamp(3) with time zone,
    salt character varying,
    hash character varying,
    login_attempts numeric DEFAULT 0,
    lock_until timestamp(3) with time zone
);
CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;
CREATE TABLE public.users_sessions (
    _order integer NOT NULL,
    _parent_id integer NOT NULL,
    id character varying NOT NULL,
    created_at timestamp(3) with time zone,
    expires_at timestamp(3) with time zone NOT NULL
);
ALTER TABLE ONLY public._cover_letter_v ALTER COLUMN id SET DEFAULT nextval('public._cover_letter_v_id_seq'::regclass);
ALTER TABLE ONLY public._cv_v ALTER COLUMN id SET DEFAULT nextval('public._cv_v_id_seq'::regclass);
ALTER TABLE ONLY public._cv_v_version_certificates ALTER COLUMN id SET DEFAULT nextval('public._cv_v_version_certificates_id_seq'::regclass);
ALTER TABLE ONLY public._cv_v_version_education ALTER COLUMN id SET DEFAULT nextval('public._cv_v_version_education_id_seq'::regclass);
ALTER TABLE ONLY public._cv_v_version_experience ALTER COLUMN id SET DEFAULT nextval('public._cv_v_version_experience_id_seq'::regclass);
ALTER TABLE ONLY public._cv_v_version_languages ALTER COLUMN id SET DEFAULT nextval('public._cv_v_version_languages_id_seq'::regclass);
ALTER TABLE ONLY public._cv_v_version_skills ALTER COLUMN id SET DEFAULT nextval('public._cv_v_version_skills_id_seq'::regclass);
ALTER TABLE ONLY public.cover_letter ALTER COLUMN id SET DEFAULT nextval('public.cover_letter_id_seq'::regclass);
ALTER TABLE ONLY public.cv ALTER COLUMN id SET DEFAULT nextval('public.cv_id_seq'::regclass);
ALTER TABLE ONLY public.media ALTER COLUMN id SET DEFAULT nextval('public.media_id_seq'::regclass);
ALTER TABLE ONLY public.payload_kv ALTER COLUMN id SET DEFAULT nextval('public.payload_kv_id_seq'::regclass);
ALTER TABLE ONLY public.payload_locked_documents ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_id_seq'::regclass);
ALTER TABLE ONLY public.payload_locked_documents_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_locked_documents_rels_id_seq'::regclass);
ALTER TABLE ONLY public.payload_migrations ALTER COLUMN id SET DEFAULT nextval('public.payload_migrations_id_seq'::regclass);
ALTER TABLE ONLY public.payload_preferences ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_id_seq'::regclass);
ALTER TABLE ONLY public.payload_preferences_rels ALTER COLUMN id SET DEFAULT nextval('public.payload_preferences_rels_id_seq'::regclass);
ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);
ALTER TABLE ONLY public._cover_letter_v
    ADD CONSTRAINT _cover_letter_v_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._cv_v
    ADD CONSTRAINT _cv_v_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._cv_v_version_certificates
    ADD CONSTRAINT _cv_v_version_certificates_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._cv_v_version_education
    ADD CONSTRAINT _cv_v_version_education_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._cv_v_version_experience
    ADD CONSTRAINT _cv_v_version_experience_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._cv_v_version_languages
    ADD CONSTRAINT _cv_v_version_languages_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public._cv_v_version_skills
    ADD CONSTRAINT _cv_v_version_skills_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cover_letter
    ADD CONSTRAINT cover_letter_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cv_certificates
    ADD CONSTRAINT cv_certificates_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cv_education
    ADD CONSTRAINT cv_education_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cv_experience
    ADD CONSTRAINT cv_experience_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cv_languages
    ADD CONSTRAINT cv_languages_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cv
    ADD CONSTRAINT cv_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.cv_skills
    ADD CONSTRAINT cv_skills_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.media
    ADD CONSTRAINT media_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payload_kv
    ADD CONSTRAINT payload_kv_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payload_locked_documents
    ADD CONSTRAINT payload_locked_documents_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payload_migrations
    ADD CONSTRAINT payload_migrations_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payload_preferences
    ADD CONSTRAINT payload_preferences_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);
ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_pkey PRIMARY KEY (id);
CREATE INDEX _cover_letter_v_created_at_idx ON public._cover_letter_v USING btree (created_at);
CREATE INDEX _cover_letter_v_latest_idx ON public._cover_letter_v USING btree (latest);
CREATE INDEX _cover_letter_v_updated_at_idx ON public._cover_letter_v USING btree (updated_at);
CREATE INDEX _cover_letter_v_version_version__status_idx ON public._cover_letter_v USING btree (version__status);
CREATE INDEX _cv_v_created_at_idx ON public._cv_v USING btree (created_at);
CREATE INDEX _cv_v_latest_idx ON public._cv_v USING btree (latest);
CREATE INDEX _cv_v_updated_at_idx ON public._cv_v USING btree (updated_at);
CREATE INDEX _cv_v_version_certificates_order_idx ON public._cv_v_version_certificates USING btree (_order);
CREATE INDEX _cv_v_version_certificates_parent_id_idx ON public._cv_v_version_certificates USING btree (_parent_id);
CREATE INDEX _cv_v_version_education_order_idx ON public._cv_v_version_education USING btree (_order);
CREATE INDEX _cv_v_version_education_parent_id_idx ON public._cv_v_version_education USING btree (_parent_id);
CREATE INDEX _cv_v_version_experience_order_idx ON public._cv_v_version_experience USING btree (_order);
CREATE INDEX _cv_v_version_experience_parent_id_idx ON public._cv_v_version_experience USING btree (_parent_id);
CREATE INDEX _cv_v_version_languages_order_idx ON public._cv_v_version_languages USING btree (_order);
CREATE INDEX _cv_v_version_languages_parent_id_idx ON public._cv_v_version_languages USING btree (_parent_id);
CREATE INDEX _cv_v_version_skills_order_idx ON public._cv_v_version_skills USING btree (_order);
CREATE INDEX _cv_v_version_skills_parent_id_idx ON public._cv_v_version_skills USING btree (_parent_id);
CREATE INDEX _cv_v_version_version__status_idx ON public._cv_v USING btree (version__status);
CREATE INDEX _cv_v_version_version_profile_image_idx ON public._cv_v USING btree (version_profile_image_id);
CREATE INDEX _cv_v_version_version_logo_idx ON public._cv_v USING btree (version_logo_id);
CREATE INDEX cover_letter__status_idx ON public.cover_letter USING btree (_status);
CREATE INDEX cv__status_idx ON public.cv USING btree (_status);
CREATE INDEX cv_certificates_order_idx ON public.cv_certificates USING btree (_order);
CREATE INDEX cv_certificates_parent_id_idx ON public.cv_certificates USING btree (_parent_id);
CREATE INDEX cv_education_order_idx ON public.cv_education USING btree (_order);
CREATE INDEX cv_education_parent_id_idx ON public.cv_education USING btree (_parent_id);
CREATE INDEX cv_experience_order_idx ON public.cv_experience USING btree (_order);
CREATE INDEX cv_experience_parent_id_idx ON public.cv_experience USING btree (_parent_id);
CREATE INDEX cv_languages_order_idx ON public.cv_languages USING btree (_order);
CREATE INDEX cv_languages_parent_id_idx ON public.cv_languages USING btree (_parent_id);
CREATE INDEX cv_profile_image_idx ON public.cv USING btree (profile_image_id);
CREATE INDEX cv_logo_idx ON public.cv USING btree (logo_id);
CREATE INDEX cv_skills_order_idx ON public.cv_skills USING btree (_order);
CREATE INDEX cv_skills_parent_id_idx ON public.cv_skills USING btree (_parent_id);
CREATE INDEX media_created_at_idx ON public.media USING btree (created_at);
CREATE UNIQUE INDEX media_filename_idx ON public.media USING btree (filename);
CREATE INDEX media_updated_at_idx ON public.media USING btree (updated_at);
CREATE UNIQUE INDEX payload_kv_key_idx ON public.payload_kv USING btree (key);
CREATE INDEX payload_locked_documents_created_at_idx ON public.payload_locked_documents USING btree (created_at);
CREATE INDEX payload_locked_documents_global_slug_idx ON public.payload_locked_documents USING btree (global_slug);
CREATE INDEX payload_locked_documents_rels_media_id_idx ON public.payload_locked_documents_rels USING btree (media_id);
CREATE INDEX payload_locked_documents_rels_order_idx ON public.payload_locked_documents_rels USING btree ("order");
CREATE INDEX payload_locked_documents_rels_parent_idx ON public.payload_locked_documents_rels USING btree (parent_id);
CREATE INDEX payload_locked_documents_rels_path_idx ON public.payload_locked_documents_rels USING btree (path);
CREATE INDEX payload_locked_documents_rels_users_id_idx ON public.payload_locked_documents_rels USING btree (users_id);
CREATE INDEX payload_locked_documents_updated_at_idx ON public.payload_locked_documents USING btree (updated_at);
CREATE INDEX payload_migrations_created_at_idx ON public.payload_migrations USING btree (created_at);
CREATE INDEX payload_migrations_updated_at_idx ON public.payload_migrations USING btree (updated_at);
CREATE INDEX payload_preferences_created_at_idx ON public.payload_preferences USING btree (created_at);
CREATE INDEX payload_preferences_key_idx ON public.payload_preferences USING btree (key);
CREATE INDEX payload_preferences_rels_order_idx ON public.payload_preferences_rels USING btree ("order");
CREATE INDEX payload_preferences_rels_parent_idx ON public.payload_preferences_rels USING btree (parent_id);
CREATE INDEX payload_preferences_rels_path_idx ON public.payload_preferences_rels USING btree (path);
CREATE INDEX payload_preferences_rels_users_id_idx ON public.payload_preferences_rels USING btree (users_id);
CREATE INDEX payload_preferences_updated_at_idx ON public.payload_preferences USING btree (updated_at);
CREATE INDEX users_created_at_idx ON public.users USING btree (created_at);
CREATE UNIQUE INDEX users_email_idx ON public.users USING btree (email);
CREATE INDEX users_sessions_order_idx ON public.users_sessions USING btree (_order);
CREATE INDEX users_sessions_parent_id_idx ON public.users_sessions USING btree (_parent_id);
CREATE INDEX users_updated_at_idx ON public.users USING btree (updated_at);
ALTER TABLE ONLY public._cv_v_version_certificates
    ADD CONSTRAINT _cv_v_version_certificates_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cv_v(id) ON DELETE CASCADE;
ALTER TABLE ONLY public._cv_v_version_education
    ADD CONSTRAINT _cv_v_version_education_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cv_v(id) ON DELETE CASCADE;
ALTER TABLE ONLY public._cv_v_version_experience
    ADD CONSTRAINT _cv_v_version_experience_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cv_v(id) ON DELETE CASCADE;
ALTER TABLE ONLY public._cv_v_version_languages
    ADD CONSTRAINT _cv_v_version_languages_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cv_v(id) ON DELETE CASCADE;
ALTER TABLE ONLY public._cv_v
    ADD CONSTRAINT _cv_v_version_profile_image_id_media_id_fk FOREIGN KEY (version_profile_image_id) REFERENCES public.media(id) ON DELETE SET NULL;
ALTER TABLE ONLY public._cv_v
    ADD CONSTRAINT _cv_v_version_logo_id_media_id_fk FOREIGN KEY (version_logo_id) REFERENCES public.media(id) ON DELETE SET NULL;
ALTER TABLE ONLY public._cv_v_version_skills
    ADD CONSTRAINT _cv_v_version_skills_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public._cv_v(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.cv_certificates
    ADD CONSTRAINT cv_certificates_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cv(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.cv_education
    ADD CONSTRAINT cv_education_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cv(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.cv_experience
    ADD CONSTRAINT cv_experience_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cv(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.cv_languages
    ADD CONSTRAINT cv_languages_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cv(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.cv
    ADD CONSTRAINT cv_profile_image_id_media_id_fk FOREIGN KEY (profile_image_id) REFERENCES public.media(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.cv
    ADD CONSTRAINT cv_logo_id_media_id_fk FOREIGN KEY (logo_id) REFERENCES public.media(id) ON DELETE SET NULL;
ALTER TABLE ONLY public.cv_skills
    ADD CONSTRAINT cv_skills_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.cv(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_media_fk FOREIGN KEY (media_id) REFERENCES public.media(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_locked_documents(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.payload_locked_documents_rels
    ADD CONSTRAINT payload_locked_documents_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_parent_fk FOREIGN KEY (parent_id) REFERENCES public.payload_preferences(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.payload_preferences_rels
    ADD CONSTRAINT payload_preferences_rels_users_fk FOREIGN KEY (users_id) REFERENCES public.users(id) ON DELETE CASCADE;
ALTER TABLE ONLY public.users_sessions
    ADD CONSTRAINT users_sessions_parent_id_fk FOREIGN KEY (_parent_id) REFERENCES public.users(id) ON DELETE CASCADE;

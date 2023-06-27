import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next/types";
import { Post } from "../../../types";

const prisma = new PrismaClient({ log: ["query"] });

// export async function GET(request: NextRequest) {
//   console.log("making GET request via sms: ", request.body);
//   return "here is some data";
// }

// const parseJSON = (params: string): Object => {
//   var searchParams = new URLSearchParams(params);
//   return Object.fromEntries([...searchParams]);
// };

// export async function POST(request: Request) {
//   const res = await request.text();
//   const parsed = parseJSON(res);
//   return NextResponse.json(parsed);
// }

// check "from" number against database
// if they are a user already, add the post to their posts
// if they are not, create:
//     - a new user
//     - a new temporary feed page for them
//     - and add this post as the first of their posts

type FeedProps = {
  to: string;
  from: string;
};

// find the feed with this unique combination of from and to numbers
// if the feed exists, post this message to it
// if the feed does not exist, create it and post this message to it

function generateRandomFeedName() {
  const adjectives = [
    "ajar",
    "rare",
    "wry",
    "bad",
    "big",
    "wide",
    "good",
    "ill",
    "near",
    "silly",
    "mad",
    "weak",
    "six",
    "low",
    "luxe",
    "bent",
    "one",
    "meek",
    "glib",
    "even",
    "hard",
    "sad",
    "rich",
    "hot",
    "keen",
    "drab",
    "soft",
    "rude",
    "huge",
    "mute",
    "used",
    "open",
    "fair",
    "two",
    "icy",
    "five",
    "high",
    "cool",
    "half",
    "ten",
    "real",
    "able",
    "flat",
    "random",
    "sassy",
    "artsy",
    "nine",
    "new",
    "sick",
    "dry",
  ];
  const nouns = [
    "cub",
    "cave",
    "cows",
    "crown",
    "cable",
    "crate",
    "cough",
    "ratio",
    "power",
    "music",
    "salad",
    "bread",
    "night",
    "cheek",
    "river",
    "drama",
    "bonus",
    "honey",
    "virus",
    "shirt",
    "phone",
    "dresser",
    "buyer",
    "topic",
    "owner",
    "uncle",
    "tooth",
    "video",
    "event",
    "basis",
    "entry",
    "brood",
    "media",
    "truth",
    "pizza",
    "fox",
    "heart",
    "story",
    "actor",
    "queen",
    "depth",
    "movie",
    "guest",
    "world",
    "child",
    "thing",
    "paper",
  ];
  const generated = `${
    adjectives[Math.floor(Math.random() * adjectives.length)]
  }-${nouns[Math.floor(Math.random() * nouns.length)]}`;
  return generated;
}

async function getUserOnFeed(props: FeedProps) {
  const { to, from } = props;
  const record = await prisma?.usersOnFeeds.findFirst({
    where: {
      feedPhone: to,
      userPhone: from,
    },
  });
  if (record) {
    return record;
  } else {
    const newRecord = await prisma?.usersOnFeeds.create({
      data: {
        feedPhone: to,
        userPhone: from,
        user: {
          connect: {
            phone: from,
          },
        },
        feed: {
          create: {
            subdomain: generateRandomFeedName(),
            owner: {
              connectOrCreate: {
                where: {
                  phone: from,
                },
                create: {
                  phone: from,
                },
              },
            },
          },
        },
      },
    });
    return newRecord;
  }
  // .then((userOnFeed) => {
  //   if (userOnFeed) {
  //     return userOnFeed.feedId;
  //   } else prisma.create;
  // })
  // // if the feed exists, return its id
  // // if the feed doesn't exist, create it and return its id
  // .then((feedId) =>
  //   prisma?.feed.findUnique({
  //     where: {
  //       id: feedId,
  //     },
  //   })
  // );
  //   if (!feed) {
  //     const newFeed = await prisma?.feed.create({
  //       data: {
  //         subdomain: to,
  //         user: {
  //           connect: {
  //             phone: from,
  //           },
  //         },
  //       },
  //     });
  //     return newFeed.id;
  //   }
  //   return feed.id;
}

type PostProps = {
  userOnFeedId: number;
  message: {
    title: string;
    content: string;
    media: string;
  };
};

async function createPost(props: PostProps) {
  const { userOnFeedId, message } = props;

  const userOnFeed = await prisma?.usersOnFeeds.findUnique({
    where: {
      id: userOnFeedId,
    },
  });

  try {
    await prisma?.post.create({
      data: {
        title: message.title,
        publishedDate: new Date(),
        content: message.content,
        media: message.media,
        feed: {
          connect: {
            id: userOnFeed.feedId,
          },
        },
        author: {
          connect: {
            id: userOnFeed.userId,
          },
        },
      },
    });
    console.log("New post visible at feed id: ", userOnFeed.feedId);
  } catch (error) {
    console.error("error creating post: ", error);
  }
  //   return newPost;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  console.log("request.body: ", request.body);
  const { title, date, author, to, content, media } = await JSON.parse(
    request.body
  );

  console.log(
    "received request: ",
    title,
    ", ",
    date,
    ", ",
    author,
    ", ",
    to,
    ", ",
    content,
    ", ",
    media
  );

  //   // TODO mpm: test this
  //   async function getUserByPhone(phoneNumber: string) {
  //     // const user = getUserBy("phone", phoneNumber);
  //     const user = await prisma.user
  //       .findUnique({
  //         where: {
  //           phone: phoneNumber,
  //         },
  //       })
  //       .then((response) => (response ? JSON.stringify(response) : null))
  //       .catch((error) => console.log(error));

  //     if (!user) {
  //       // const newUser = createUser({ phone: phoneNumber, email: ""})
  //       const newUser = await prisma.user
  //         .create({
  //           data: {
  //             phone: phoneNumber,
  //           },
  //         })
  //         .then((response) => JSON.stringify(response))
  //         .catch((error) => console.log(error));
  //       console.log("user created: ", newUser);
  //       return newUser;
  //     }
  //     console.log("user found: ", user);
  //     return user;
  //   }

  //   const user = getUserByPhone(author);

  const userOnFeed = await getUserOnFeed({ to, from: author });

  createPost({
    userOnFeedId: userOnFeed.id,
    message: { title, content, media },
  });

  //   try {
  //     await prisma?.post.create({
  //       data: {
  //         title,
  //         publishedDate: date,
  //         content,
  //         media,
  //       },
  //     });
  //     response.status(200).json({ message: "Successfully posted. I think." });
  //   } catch (error) {
  //     console.error("Unexpected error: ", error);
  //     response.status(500).json({ message: error });
  //   }
}

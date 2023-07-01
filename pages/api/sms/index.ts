import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "../../../lib/prisma";
import { generateNewFeedName } from "../../../lib/getSubdomain";

const { NEXT_PUBLIC_BASE_URL_PATH, NEXT_PUBLIC_BASE_PROTOCOL } = process.env;

type FeedProps = {
  to: string;
  from: string;
};

// check "from" number against database
// if they are a user already, add the post to their posts
// if they are not, create:
//     - a new user
//     - a new temporary feed page for them
//     - and add this post as the first of their posts

// find the feed with this unique combination of from and to numbers
// if the feed exists, post this message to it
// if the feed does not exist, create it and post this message to it

async function getUniqueFeedName() {
  const existingFeeds = await prisma?.feed.findMany({
    select: {
      subdomain: true,
    },
  });
  const existingNames = existingFeeds?.map((feed) => feed.subdomain);
  return generateNewFeedName(existingNames);
}

let uniqueFeedName = "";
let newAccount = false;

async function getUserOnFeed(props: FeedProps) {
  const { to, from } = props;
  const record = await prisma?.usersOnFeeds.findFirst({
    where: {
      feedPhone: to,
      userPhone: from,
    },
    include: {
      feed: true,
    },
  });
  if (record) {
    uniqueFeedName = record.feed.subdomain;
    return record;
  } else {
    let feedName = await getUniqueFeedName();
    newAccount = true;
    console.log("creating new feedName: ", feedName);
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
            subdomain: feedName,
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
    uniqueFeedName = feedName;
    return newRecord;
  }
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
    console.log("Feed: ", uniqueFeedName, " isNew: ", newAccount);
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

  const userOnFeed = await getUserOnFeed({ to, from: author });

  try {
    createPost({
      userOnFeedId: userOnFeed.id,
      message: { title, content, media },
    }).then((resultFromPrisma) =>
      console.log("resultFromPrisma: ", resultFromPrisma)
    );
    response.status(200).json({
      feedUrl: `${NEXT_PUBLIC_BASE_PROTOCOL}${uniqueFeedName}.${NEXT_PUBLIC_BASE_URL_PATH}/posts`,
      isNewFeed: newAccount,
    });
  } catch (error) {
    console.error("Unexpected error: ", error);
    response.status(500).json({ message: error });
  }
}

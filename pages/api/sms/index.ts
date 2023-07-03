import { NextApiRequest, NextApiResponse } from "next/types";
import prisma from "../../../lib/prisma";
import { generateNewFeedName } from "../../../lib/generateSubdomain";

const { NEXT_PUBLIC_BASE_URL_PATH, NEXT_PUBLIC_BASE_PROTOCOL } = process.env;

// successful test body (including wrapping quotes):  "{\"author\": \"+14056403957\",\"to\": \"+14406936546\",\"content\": \"bar\",\"date\": \"2023-07-02T14:53:23.195Z\"}"

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
  textMessageId?: string;
  message: {
    title: string;
    content: string;
    media: string;
  };
};

async function createPost(props: PostProps) {
  const { userOnFeedId, message } = props;
  console.log(
    "creating post with message: ",
    message,
    " and userOnFeedId: ",
    userOnFeedId
  );

  const userOnFeed = await prisma?.usersOnFeeds.findUnique({
    where: {
      id: userOnFeedId,
    },
  });

  console.log("full userOnFeed: ", userOnFeed);

  const newPost = await prisma?.post.create({
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
  console.log("newPost: ", newPost);
  console.log("Feed: ", uniqueFeedName, " isNew: ", newAccount);
  return newPost;
}

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponse
) {
  console.log("request.body in handler: ", request.body);
  if (request.method === "POST") {
    const { title, date, author, to, content, media, textMessageId } =
      await JSON.parse(request.body);
    if (!author || !to) {
      return response.status(400).json({ message: "Missing required fields" });
    }

    const userOnFeed = await getUserOnFeed({ to, from: author });
    console.log("userOnFeed in handler: ", userOnFeed);

    try {
      const resultFromPrisma = await createPost({
        userOnFeedId: userOnFeed.id,
        textMessageId: textMessageId,
        message: { title, content, media },
      });
      console.log("resultFromPrisma in handler: ", resultFromPrisma);
      response.status(200).json({
        feedUrl: `${NEXT_PUBLIC_BASE_PROTOCOL}${uniqueFeedName}.${NEXT_PUBLIC_BASE_URL_PATH}/posts`,
        isNewFeed: newAccount,
      });
    } catch (error) {
      console.error("Unexpected error when posting: ", error);
      response.status(500).json({ message: error });
    }
  }
  if (request.method === "PATCH") {
    const { textMessageId, content, title, media } = await JSON.parse(
      request.body
    );
    if (!textMessageId) {
      return response.status(400).json({ message: "Missing textMessageId" });
    }

    const existingMessage = await prisma?.post.findUnique({
      where: {
        textMessageId: textMessageId,
      },
    });
    if (!existingMessage) {
      throw new Error("No message found with that textMessageId");
    }
    try {
      const updateMessage = await prisma?.post.update({
        where: {
          textMessageId: textMessageId,
        },
        data: {
          content: content || existingMessage.content,
          title: title || existingMessage.title,
          media: [...existingMessage.media, ...media],
        },
      });
      response
        .status(200)
        .json({ message: "successfully updated message: ", updateMessage });
    } catch (error) {
      console.error(
        "Unexpected error when updating ",
        textMessageId,
        ". Error: ",
        error
      );
      response.status(500).json({ message: error });
    }
  }
}

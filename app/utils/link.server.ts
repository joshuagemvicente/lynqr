import { prisma } from "~/lib/prisma";


export async function getAllLinks() {
  const links = await prisma.link.findMany({
    select: {
      id: true,
      title: true,
      description: true,
      link: true,
      icon: true,
      isActive: true,
      clicks: true,
      createdAt: true,
    }
  });

  return links
}

export async function getLinksByUserId(userId: string) {
  if (!userId) return [];

  const links = await prisma.link.findMany({
    where: {
      userId
    },
    select: {
      id: true,
      title: true,
      description: true,
      link: true,
      icon: true,
      isActive: true,
      clicks: true,
      createdAt: true,
    }
  });

  return links.map(link => ({
    ...link,
    clicks: link.clicks?.length || 0
  }));
}


export async function getLinkById(linkId: string) {
  const link = await prisma.link.findUnique({
    where: {
      id: linkId
    },
    select: {
      title: true,
      description: true,
      link: true,
      clicks: true,
      createdAt: true,
    }
  })

  return link
}


export async function updateLinkStatus(linkId: string, status: boolean) {
  const link = await prisma.link.findUnique({
    where: {
      id: linkId
    }
  })

  if (!link) {
    throw new Error('Link not found.')
  }

  const updatedLink = await prisma.link.update({
    where: {
      id: linkId
    },
    data: {
      isActive: status
    }
  })

  return updatedLink
}


export async function deleteLinkById(linkId: string) {
  const link = await prisma.link.delete({
    where: {
      id: linkId
    }
  })

  if (!link) {
    throw new Error('Link not found.')

  }

  return link

}

export async function incrementLinkClicks(linkId: string) {
  const link = await prisma.link.findUnique({
    where: {
      id: linkId
    }
  })

  if (!link) {
    throw new Error('Link not found.')
  }

  const click = await prisma.click.create({
    data: {
      linkId: linkId
    }
  });

  return click;
}
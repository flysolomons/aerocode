from wagtail import hooks
from wagtail.admin.menu import MenuItem


def get_job_vacancy_menu_item():
    return MenuItem(
        label="Job Vacancies",
        url="/admin/snippets/about/jobvacancy/",
        name="job_vacancies",
        icon_name="clipboard-list",
        order=9005,  # After airports (9003) and port pairs (9004), before uploaded data (9999)
    )


hooks.register("register_admin_menu_item", get_job_vacancy_menu_item)